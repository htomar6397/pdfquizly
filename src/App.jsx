import React, { useState, useEffect } from 'react';
import { useToast } from './hooks/useToast';
import Toast from './components/Toast';
import axios from 'axios';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Loading from './components/Loading';
import Quiz from './components/Quiz';
import Result from './components/Result';
import History from './components/History';

import { extractTextFromPDF } from './utils/pdfUtils';
import { validation, sanitize, RateLimiter } from './utils/validation';

// --- Logic Functions ---

// Rate limiter for API calls
const rateLimiter = new RateLimiter(5, 60000); // 5 requests per minute

async function generateQuiz(text, difficulty, numQuestions, addToast) {
  // Validate API key
  const apiKey = import.meta.env.VITE_APP_API_KEY;
  const apiValidation = validation.validateApiKey(apiKey);
  if (!apiValidation.isValid) {
    throw new Error(`API Configuration Error: ${apiValidation.errors.join(', ')}`);
  }

  // Validate input parameters
  const settingsValidation = validation.validateQuizSettings(difficulty, numQuestions);
  if (!settingsValidation.isValid) {
    throw new Error(`Invalid Settings: ${settingsValidation.errors.join(', ')}`);
  }

  const textValidation = validation.validateExtractedText(text);
  if (!textValidation.isValid) {
    throw new Error(`Content Error: ${textValidation.errors.join(', ')}`);
  }

  // Check rate limiting
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = Math.ceil(rateLimiter.getTimeUntilReset() / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`);
  }

  // Sanitize input text
  const sanitizedText = sanitize.text(text);
  
  const prompt = `You are a professional exam question generator for educational platforms.

Your task is to create exactly ${numQuestions} high-quality multiple-choice questions (MCQs) from the content provided below.

Follow these strict guidelines:
1. Each question must have exactly 4 options.
2. Only one option should be correct.
3. Questions should be aligned to ${difficulty} difficulty.
4. The output must be strictly in this valid JSON array format:

[
  {
    "question": "Write the question here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "The correct option as it appears in options"
  }
]

Do not include explanations, summaries, or any extra information outside this JSON structure.

---

Content:
${sanitizedText}
`;

  try {
    rateLimiter.recordRequest();
    
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
      },
      { 
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    const content = response.data.choices[0].message.content;
    const match = content.match(/\[.*\]/s);
    
    if (!match) {
      throw new Error('AI response does not contain valid JSON format');
    }

    const questions = JSON.parse(match[0]);
    
    // Validate generated questions
    const questionsValidation = validation.validateQuizQuestions(questions);
    if (!questionsValidation.isValid) {
      throw new Error(`Generated Quiz Error: ${questionsValidation.errors.join(', ')}`);
    }

    if (addToast) {
      addToast(`Successfully generated ${questions.length} questions!`, 'success');
    }

    return questions;
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please wait a moment and try again.');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    }
    if (error.response?.status >= 500) {
      throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
    
    // Re-throw validation and parsing errors as-is
    if (error.message.includes('Error:')) {
      throw error;
    }
    
    throw new Error(`Quiz generation failed: ${error.message}`);
  }
}

// --- Main App ---

export default function App() {
  const { toasts, addToast, removeToast } = useToast();
  const [step, setStep] = useState("hero");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'history'

  // Load quiz history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      try {
        setQuizHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading quiz history:', error);
      }
    }
  }, []);

  // Transform quiz data to match expected format
  const transformQuizData = (quiz) => {
    return quiz.map((q) => {
      // Find the index of the correct answer in the options array
      let correctIndex = q.options.findIndex(option => option === q.correct);
      
      // If exact match not found, try case-insensitive comparison
      if (correctIndex === -1) {
        correctIndex = q.options.findIndex(option => 
          option.toString().toLowerCase() === q.correct.toString().toLowerCase()
        );
      }
      
      // If still not found, default to first option
      if (correctIndex === -1) {
        console.warn(`Could not find correct answer '${q.correct}' in options for question: ${q.question}`);
        correctIndex = 0;
      }
      
      return {
        question: q.question,
        options: [...q.options],
        correctAnswer: correctIndex,
        explanation: q.explanation || ''
      };
    });
  };

  // Save quiz to history
  const saveQuizToHistory = (questions, metadata) => {
    const historyEntry = {
      id: Date.now().toString(),
      questions,
      ...metadata,
      createdAt: new Date().toISOString(),
      completed: false,
      score: null,
      answers: null
    };
    
    const updatedHistory = [historyEntry, ...quizHistory].slice(0, 50);
    setQuizHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    
    return historyEntry.id;
  };

  // Handle file upload and quiz generation
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      addToast('Please select a PDF file', 'error');
      return;
    }

    if (file.type !== 'application/pdf') {
      addToast('Please upload a valid PDF file', 'error');
      return;
    }

    setError('');
    setStep('loading');
    setProgress(20);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      setProgress(50);

      // Generate quiz questions
      const quiz = await generateQuiz(text, difficulty, numQuestions, addToast);
      setProgress(80);

      // Transform quiz data
      const transformedQuiz = transformQuizData(quiz);
      
      // Save to history
      saveQuizToHistory(transformedQuiz, {
        difficulty,
        numQuestions,
        fileName: file.name,
        fileSize: file.size
      });

      setQuestions(transformedQuiz);
      setProgress(100);
      setTimeout(() => setStep('quiz'), 500);
      
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err.message || 'Failed to process PDF');
      addToast(err.message || 'Failed to process PDF', 'error');
      setStep('hero');
    }
  };

  // Handle quiz completion
  const handleFinish = (ans) => {
    setAnswers(ans);
    
    // Calculate score
    const correctCount = questions.reduce((count, q, index) => {
      return count + (q.correctAnswer === ans[index] ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Update quiz in history as completed
    const updatedHistory = quizHistory.map(q => {
      if (q.questions === questions) {
        return {
          ...q,
          completed: true,
          score,
          answers: ans,
          completedAt: new Date().toISOString()
        };
      }
      return q;
    });
    
    setQuizHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    
    setStep('result');
  };

  // Handle quiz restart
  const handleRestart = () => {
    setQuestions([]);
    setAnswers([]);
    setError('');
    setStep('hero');
    setProgress(0);
  };

  // Handle view change (home/history)
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'home') {
      setStep('hero');
    }
  };

  // Render the current view
  const renderView = () => {
    if (currentView === 'history') {
      return <History onBackToHome={() => handleViewChange('home')} />;
    }

    switch (step) {
      case 'loading':
        return <Loading progress={progress} />;
      case 'quiz':
        return <Quiz questions={questions} onFinish={handleFinish} />;
      case 'result':
        return (
          <Result
            questions={questions}
            answers={answers}
            onRestart={handleRestart}
          />
        );
      case 'hero':
      default:
        return (
          <Hero
            onUpload={handleUpload}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            error={error}
          />
        );
    }
  };

  // Determine if we're on a quiz-related page
  const isQuizPage = step === 'quiz' || step === 'result';
  const mainClasses = `flex-grow ${!isQuizPage ? 'mt-16' : ''}`;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {!isQuizPage && (
          <Navbar 
            currentView={currentView}
            onShowHistory={handleViewChange}
          />
        )}
        <main className={mainClasses}>
          {renderView()}
        </main>
        {!isQuizPage && <Footer />}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {toasts.map(toast => (
            <Toast 
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

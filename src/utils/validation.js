// Input validation utilities
export const validation = {
  // File validation
  validatePDFFile: (file) => {
    const errors = [];
    
    if (!file) {
      errors.push('Please select a file');
      return { isValid: false, errors };
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      errors.push('Please select a PDF file');
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      errors.push('File size must be less than 50MB');
    }
    
    // Check if file is empty
    if (file.size === 0) {
      errors.push('File appears to be empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Quiz settings validation
  validateQuizSettings: (difficulty, numQuestions) => {
    const errors = [];
    
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      errors.push('Please select a valid difficulty level');
    }
    
    if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > 20) {
      errors.push('Number of questions must be between 1 and 20');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // API key validation
  validateApiKey: (apiKey) => {
    const errors = [];
    
    if (!apiKey || typeof apiKey !== 'string') {
      errors.push('API key is required');
      return { isValid: false, errors };
    }
    
    if (apiKey.trim().length === 0) {
      errors.push('API key cannot be empty');
    }
    
    // Basic format check for Groq API key
    if (!apiKey.startsWith('gsk_')) {
      errors.push('Invalid API key format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Text content validation
  validateExtractedText: (text) => {
    const errors = [];
    
    if (!text || typeof text !== 'string') {
      errors.push('No text content found');
      return { isValid: false, errors };
    }
    
    const trimmedText = text.trim();
    
    if (trimmedText.length === 0) {
      errors.push('No readable text found in the PDF');
    }
    
    // Minimum content length check
    if (trimmedText.length < 100) {
      errors.push('PDF content is too short to generate meaningful questions');
    }
    
    // Maximum content length check (to prevent API overload)
    if (trimmedText.length > 50000) {
      errors.push('PDF content is too long. Please use a shorter document.');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      wordCount: trimmedText.split(/\s+/).length
    };
  },

  // Quiz questions validation
  validateQuizQuestions: (questions) => {
    const errors = [];
    
    if (!Array.isArray(questions)) {
      errors.push('Invalid quiz format received');
      return { isValid: false, errors };
    }
    
    if (questions.length === 0) {
      errors.push('No questions were generated');
      return { isValid: false, errors };
    }
    
    questions.forEach((question, index) => {
      if (!question.question || typeof question.question !== 'string') {
        errors.push(`Question ${index + 1}: Missing or invalid question text`);
      }
      
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        errors.push(`Question ${index + 1}: Must have exactly 4 options`);
      }
      
      if (!question.correct || !question.options?.includes(question.correct)) {
        errors.push(`Question ${index + 1}: Invalid or missing correct answer`);
      }
      
      // Check for duplicate options
      if (question.options && new Set(question.options).size !== question.options.length) {
        errors.push(`Question ${index + 1}: Contains duplicate answer options`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Sanitization utilities
export const sanitize = {
  // Sanitize text input
  text: (input) => {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
  },

  // Sanitize filename
  filename: (filename) => {
    if (typeof filename !== 'string') return 'untitled';
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100);
  }
};

// Rate limiting utility
export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  getTimeUntilReset() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest));
  }
}

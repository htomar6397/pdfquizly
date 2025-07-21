# PdfQuizly - Transform PDFs into Interactive Quizzes

PdfQuizly is a modern web application that converts PDF documents into interactive quizzes. It supports two main modes: generating new quizzes from PDF content and creating Previous Year Question (PYQ) based quizzes.

## 🌟 Features

- **PDF to Quiz Conversion**: Upload any PDF and generate a quiz based on its content
- **PYQ Mode**: Generate quizzes from previous year questions with exam type and year selection
- **Responsive Design**: Works on desktop and mobile devices
- **Quiz History**: Tracks and saves your quiz attempts with local storage
- **Timer**: Built-in timer for timed quiz sessions
- **Toast Notifications**: User-friendly feedback system

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pdftoquiz.git
   cd pdftoquiz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks
- **PDF Processing**: pdf.js
- **API**: Groq API for quiz generation

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── App.jsx        # Main application component
```

## 📝 Usage

1. **Home Page**
   - Upload a PDF file
   - Select quiz mode: New Quiz or PYQ
   - Choose difficulty level
   - For PYQ mode, select exam type and year

2. **Quiz Page**
   - Answer the generated questions
   - Track your progress with the timer
   - Submit when finished

3. **Results Page**
   - View your score
   - Review correct/incorrect answers
   - Option to retry or start a new quiz

## 📱 Responsive Design

PdfQuizly is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## 🔒 Security

- Input validation and sanitization
- Rate limiting for API calls
- Secure API key handling

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- PDF processing with [PDF.js](https://mozilla.github.io/pdf.js/)

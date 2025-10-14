# 🎨 Frontend - Healthcare Symptom Checker

> Modern React application with professional UI/UX

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Components](#components)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Development](#development)

---

## 🌟 Overview

React 18 frontend application providing an intuitive interface for AI-powered symptom analysis. Built with Vite for optimal development experience and performance.

### User Flow

```
Landing Page
     ↓
Symptom Input Form
     ↓
AI Processing (Loading)
     ↓
Clarification Questions
     ↓
AI Analysis (Loading)
     ↓
Results Display
```

---

## ✨ Features

- ✅ React 18 with Hooks
- ✅ Vite for fast builds
- ✅ Responsive design (mobile-first)
- ✅ Custom CSS with variables
- ✅ Loading states & error handling
- ✅ Request timeout handling
- ✅ Accessibility (WCAG 2.1)
- ✅ Emergency detection UI
- ✅ Professional medical disclaimer

---

## 🚀 Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template (optional)
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Optional - defaults to http://localhost:3001
VITE_API_BASE_URL=http://localhost:3001
```

### Vite Config

```javascript
// vite.config.js
export default {
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}
```

---

## 🧩 Components

### App.jsx
Main application component managing global state

**State:**
- `appState`: current view (initial/clarifying/analyzing/results/emergency/error)
- `initialSymptom`: user's first symptom input
- `questions`: AI-generated questions
- `analysisResult`: final AI analysis
- `errorMessage`: error display

### SymptomInput.jsx
Initial symptom collection form

**Props:** `onSubmit(symptom)`

**Features:**
- Textarea with character count
- Validation (3-500 chars)
- Medical disclaimer checkbox
- Submit button with loading state

### ClarificationQuestions.jsx
Dynamic question form

**Props:** `questions`, `onSubmit(answers)`, `onBack()`

**Features:**
- Dynamic question rendering
- Individual text inputs
- Back button
- Form validation

### ResultsDisplay.jsx
Analysis results display

**Props:** `result`, `onReset()`

**Features:**
- Condition cards with match percentage
- Recommendations list
- Urgency badge
- Source attribution
- Summary section

### LoadingSpinner.jsx
Loading indicator

**Features:**
- Animated CSS spinner
- Accessible with aria-label

---

## 🎨 Styling

### Design System

**Colors:**
```css
--primary-600: #0284c7;    /* Medical blue */
--success: #10b981;         /* Green */
--error: #ef4444;           /* Red */
--warning: #f59e0b;         /* Orange */
```

**Typography:**
```css
font-family: 'Inter', sans-serif;
Base size: 16px
Line height: 1.6
```

**Spacing:**
```css
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

### Responsive Breakpoints

```css
Mobile: < 480px
Tablet: 480px - 768px
Desktop: > 768px
```

---

## 🔌 API Integration

### API Utility (`utils/api.js`)

```javascript
import { apiPost } from './utils/api';

// Usage
const data = await apiPost('/api/start-check', { symptom });
```

**Features:**
- 30-second timeout
- Automatic error handling
- JSON parsing
- AbortController for cancellation

### Error Handling

```javascript
try {
  const data = await apiPost('/api/analyze', { fullContext });
} catch (error) {
  setErrorMessage(error.message);
  setAppState('error');
}
```

---

## 🛠️ Development

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ClarificationQuestions.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ResultsDisplay.jsx
│   │   └── SymptomInput.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Scripts

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code (coming soon)
```

### Build Output

```bash
dist/
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── index.html
```

---

## 🎭 State Management

### State Flow

```
User Action
     ↓
Update State (useState)
     ↓
API Call
     ↓
Update State with Response
     ↓
Render New Component
```

### State Machine

```
initial → analyzing → clarifying → analyzing → results
            ↓                                      ↓
         error                                  initial
            ↓
       emergency
```

---

## 📱 Responsive Design

### Mobile (< 480px)
- Single column layout
- Full-width buttons
- Larger touch targets
- Simplified header

### Tablet (480-768px)
- Adjusted padding
- Flexible containers
- Stack form actions

### Desktop (> 768px)
- Max-width containers (900px)
- Side-by-side buttons
- Enhanced spacing

---

## ♿ Accessibility

### WCAG 2.1 Compliance

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Color contrast (4.5:1)
- ✅ Screen reader support

### Screen Reader Text

```jsx
<button aria-label="Submit symptom for analysis">
  Analyze Symptoms
</button>
```

---

## 🧪 Testing

```bash
# Coming soon
npm test
```

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

**DevDependencies:**
```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "vite": "^5.0.8"
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Vite Port Error**
```bash
# Change port in vite.config.js
server: { port: 5174 }
```

**API Connection Error**
```bash
# Check backend is running on correct port
# Verify VITE_API_BASE_URL in .env
```

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

---

## 🤝 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md)

---

<div align="center">

[⬆ Back to Main README](../README.md)

Made with ⚛️ React & ⚡ Vite

</div>

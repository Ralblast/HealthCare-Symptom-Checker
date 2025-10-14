# 🔧 Backend - Healthcare Symptom Checker API

> RESTful API server built with Express.js, MongoDB, and Groq AI

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security](#security)
- [Development](#development)

---

## 🌟 Overview

Express.js backend server providing AI-powered symptom analysis through a secure RESTful API. Integrates with Groq's Llama 3.3 model for intelligent medical reasoning.

### Architecture

```
Client Request
     ↓
[Validation Middleware]
     ↓
[Sanitization Middleware]
     ↓
[Route Handlers]
     ↓
[AI Service / Database]
     ↓
[Response with Error Handling]
```

---

## ✨ Features

- ✅ RESTful API design
- ✅ MongoDB integration with Mongoose ODM
- ✅ Groq AI (Llama 3.3) integration
- ✅ Input validation & sanitization
- ✅ Rate limiting (100 req/15min)
- ✅ Security headers (Helmet.js)
- ✅ CORS configuration
- ✅ Structured JSON logging
- ✅ Error handling middleware
- ✅ Request timeout handling
- ✅ Retry logic for AI requests

---

## 🚀 Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Groq AI API key | Yes | `gsk_xxx...` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `PORT` | Server port | No | `3001` |
| `NODE_ENV` | Environment | No | `development` |
| `FRONTEND_URL` | CORS allowed origin | No | `http://localhost:5173` |

### Example .env

```env
GROQ_API_KEY=gsk_your_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/<database_name>
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-15T00:00:00.000Z",
  "environment": "development",
  "database": "connected"
}
```

### Start Symptom Check
```http
POST /api/start-check
Content-Type: application/json

{
  "symptom": "severe headache with nausea"
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    "How long have you been experiencing this?",
    "Rate severity from 1-10?",
    "Any visual disturbances?"
  ]
}
```

### Analyze Symptoms
```http
POST /api/analyze
Content-Type: application/json

{
  "fullContext": "Initial symptom: headache. Duration: 2 days. Severity: 8/10"
}
```

### Get All Conditions
```http
GET /api/conditions
```

### Get Query History
```http
GET /api/history
```

### Get Statistics
```http
GET /api/stats
```

---

## 🗄️ Database Schema

### MedicalCondition
```javascript
{
  condition: String (unique, required),
  symptoms: [String] (required),
  description: String (required),
  recommendations: [String] (required),
  source: String (required),
  severity: String (enum: low/medium/high/emergency),
  createdAt: Date,
  updatedAt: Date
}
```

### QueryHistory
```javascript
{
  symptom: String (required),
  clarificationAnswers: [{
    question: String,
    answer: String
  }],
  analysisResult: Mixed,
  isEmergency: Boolean,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security

### Implemented Features

1. **Helmet.js** - Security headers
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options

2. **CORS** - Cross-Origin Resource Sharing
   - Restricted to frontend URL
   - Credentials support

3. **Rate Limiting**
   - 100 requests per 15 minutes
   - Per IP address

4. **Input Validation**
   - Length checks (3-500 chars for symptoms)
   - Type validation
   - Required field checks

5. **Input Sanitization**
   - XSS prevention
   - Script tag removal
   - Event handler removal

6. **Error Handling**
   - No stack traces in production
   - Structured error responses
   - Proper HTTP status codes

---

## 🛠️ Development

### Project Structure

```
backend/
├── config/
│   ├── constants.js        # App constants
│   └── database.js         # DB connection
├── middleware/
│   ├── errorHandler.js     # Error middleware
│   ├── sanitization.js     # Input sanitization
│   └── validation.js       # Input validation
├── models/
│   ├── MedicalCondition.js
│   └── QueryHistory.js
├── services/
│   ├── aiService.js        # Groq AI integration
│   └── seedDatabase.js     # DB seeding
├── utils/
│   ├── helpers.js          # Utility functions
│   └── logger.js           # Structured logging
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js               # Entry point
```

### Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with medical data
npm test         # Run tests (coming soon)
```

### Adding New Medical Conditions

Edit `services/seedDatabase.js`:

```javascript
{
  condition: "Condition Name",
  symptoms: ["symptom1", "symptom2"],
  description: "Detailed description",
  recommendations: ["rec1", "rec2"],
  source: "Medical Source",
  severity: "medium"
}
```

Then run: `npm run seed`

---

## 📊 Logging

Structured JSON logging for production monitoring:

```json
{
  "level": "INFO",
  "message": "Server started successfully",
  "port": "3001",
  "environment": "production",
  "timestamp": "2025-10-15T00:00:00.000Z"
}
```

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Ensure credentials are correct
```

**Groq API Error**
```bash
# Verify API key in .env
# Check Groq API status
# Review rate limits
```

**Port Already in Use**
```bash
# Change PORT in .env
# Or kill process: lsof -ti:3001 | xargs kill
```

---

## 🤝 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📝 License

MIT License - See [LICENSE](../LICENSE)

---

<div align="center">

[⬆ Back to Main README](../README.md)

Made with ❤️ using Node.js & Express

</div>

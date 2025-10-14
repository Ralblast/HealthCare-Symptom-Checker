# 🏥 Healthcare Symptom Checker

> **AI-Powered Medical Analysis Platform** | MERN Stack + Groq AI (Llama 3.3)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Healthcare Symptom Checker is a full-stack web application that uses **AI (Llama 3.3 70B)** to analyze user-reported symptoms and provide:
- Probable medical conditions
- Detailed recommendations
- Urgency level assessment
- Emergency keyword detection

**⚠️ Disclaimer:** This is an **educational tool only** and not a substitute for professional medical advice.

---

## ✨ Features

### Core Functionality
- ✅ **AI-Powered Analysis** - Uses Groq AI (Llama 3.3) for intelligent symptom interpretation
- ✅ **Clarification Questions** - Dynamic follow-up questions for accurate diagnosis
- ✅ **Medical Knowledge Base** - 6+ common conditions with symptoms, descriptions, and recommendations
- ✅ **Emergency Detection** - Automatic identification of critical symptoms requiring immediate care
- ✅ **Query History** - Track and analyze past symptom checks

### Technical Features
- ✅ **Production-Grade Security** - Helmet, CORS, Rate Limiting, Input Sanitization
- ✅ **Structured Logging** - JSON logging for monitoring and debugging
- ✅ **Error Handling** - Comprehensive error handling with user-friendly messages
- ✅ **Request Timeout** - Prevents hanging requests
- ✅ **Retry Logic** - Exponential backoff for AI requests
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Accessibility** - WCAG 2.1 compliant

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **AI/LLM:** Groq AI (Llama 3.3 70B)
- **Security:** Helmet, CORS, Express Rate Limit
- **Validation:** Custom middleware with sanitization

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Custom CSS with CSS Variables
- **HTTP Client:** Fetch API with timeout wrapper

### DevOps
- **Version Control:** Git
- **Environment:** dotenv
- **Package Manager:** npm

---

## 🏗️ Architecture

┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ ┌─────────────┐ ┌──────────────┐ ┌─────────────────┐ │
│ │ Symptom │ │ Clarification│ │ Results │ │
│ │ Input │→ │ Questions │→ │ Display │ │
│ └─────────────┘ └──────────────┘ └─────────────────┘ │
└────────────────────────┬─────────────────────────────────────┘
│ HTTP/JSON
↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Express.js) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Validation │→ │ Controllers │→ │ AI Service │ │
│ │ Middleware │ │ (Routes) │ │ (Groq/Llama) │ │
│ └──────────────┘ └──────────────┘ └──────────────────┘ │
│ ↓ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ MongoDB (Medical Conditions + History) │ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘


---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB Atlas account (free tier)
- Groq API key ([Get here](https://console.groq.com))

### Step 1: Clone Repository

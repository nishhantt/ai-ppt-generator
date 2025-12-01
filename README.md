AI PowerPoint Generator

Transform ideas into professional PowerPoint presentations through natural language conversations powered by AI.


What It Does
An intelligent web application that generates complete PowerPoint presentations from simple text descriptions. Users chat with an AI assistant that understands their needs, creates structured slides, and delivers downloadable presentations instantly.
Key Features:

Google OAuth authentication with personalized experience
AI-powered presentation generation from natural language
Smart learning system that detects user type (student/corporate/researcher)
Context-aware conversations with memory
Real-time slide preview and editing capabilities
One-click PPTX download
Analytics dashboard tracking usage and preferences


How It Works
Authentication Flow
User Login → Google OAuth → JWT Token → Personalized Dashboard
Presentation Generation Pipeline
1. User types request in chat (e.g., "Create a 10-slide presentation about AI")
2. Request sent to backend with user context and preferences
3. Groq AI (Llama 3.3 70B) processes the request using custom prompts
4. AI generates structured JSON with slides, titles, and content
5. Backend validates and stores the presentation data
6. Frontend displays slide previews in real-time
7. pptxgenjs library converts JSON to PowerPoint format
8. User downloads professionally formatted PPTX file
User Learning System
1. System analyzes conversation patterns and keywords
2. Detects user type: Student, Corporate, Researcher, Educator, or Entrepreneur
3. Tracks preferences: average slides, favorite topics, presentation style
4. Updates user profile with analytics (total presentations, slides created)
5. AI adapts responses based on detected user type
6. Future presentations are personalized to user preferences
Technical Architecture
Frontend (React) ←→ REST API ←→ Backend (Express) ←→ MongoDB
                                      ↓
                               Groq AI API (Llama 3.3)
                                      ↓
                              JSON Response
                                      ↓
                            pptxgenjs Library
                                      ↓
                          PowerPoint File (.pptx)

Tech Stack
Frontend

React.js - Component-based UI framework
Vite - Fast build tool and development server
Tailwind CSS - Utility-first CSS framework for styling
Axios - HTTP client for API requests
pptxgenjs - PowerPoint file generation library
lucide-react - Modern icon library
jwt-decode - JWT token decoding

Backend

Node.js - JavaScript runtime environment
Express.js - Web application framework
MongoDB - NoSQL database for data persistence
Mongoose - MongoDB object modeling (ODM)
Groq SDK - AI API integration
Passport.js - Authentication middleware
JWT (jsonwebtoken) - Secure token-based authentication
Google Auth Library - OAuth 2.0 implementation

AI/ML

Groq API - High-performance AI inference platform
Llama 3.3 70B - Large language model for content generation
Prompt Engineering - Custom prompts for structured output
NLP - Natural language understanding for user intent

Development Tools

nodemon - Auto-restart server on changes
dotenv - Environment variable management
CORS - Cross-origin resource sharing
body-parser - Request body parsing middleware


Installation
Prerequisites

Node.js (v18+)
MongoDB (v7.0+)
Groq API Key (free at https://console.groq.com/keys)
Google OAuth Credentials (free at https://console.cloud.google.com/)

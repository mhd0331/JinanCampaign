# Jinan County Candidate Lee Woo-kyu Campaign Website

## Overview

This is a full-stack campaign website for Lee Woo-kyu, a candidate for Jinan County Mayor in South Korea. The application is built as a modern React-based campaign platform featuring candidate information, policy details, AI-powered chat consultation, and contact forms for citizen inquiries.

## System Architecture

### Full-Stack Structure
- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit platform with autoscale deployment

### Directory Structure
```
├── client/           # React frontend application
├── server/           # Express.js backend
├── shared/           # Shared schemas and types
├── migrations/       # Database migrations
└── attached_assets/  # Static assets
```

## Key Components

### Frontend Architecture
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme for campaign branding
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Google Analytics 4 with custom event tracking
- **Security**: Input validation, XSS protection, rate limiting
- **Debugging**: Performance monitoring, error tracking, network monitoring

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: PostgreSQL database storage with full CRUD operations
- **API**: RESTful endpoints for inquiries and chat functionality
- **Security**: Server-side input validation, SQL injection prevention, rate limiting middleware
- **Monitoring**: Request logging, error handling, performance tracking

### Database Schema
Comprehensive database supporting full campaign platform functionality:
1. **inquiries**: Stores citizen contact forms with name, phone, district, message, and response status
2. **chat_messages**: Stores AI chat conversations with session management
3. **cms_content**: Content management system for policies, news, announcements, and documents
4. **ai_training_docs**: AI training documents with categorization, tags, and embedding support
5. **speech_training_data**: Speech training data for voice synthesis with phonetic transcription
6. **users**: User management system for CMS access control with role-based permissions
7. **citizen_suggestions**: Citizen suggestions with categorization, priority, status tracking, and support counts
8. **public_feedback**: Public feedback and ratings with moderation capabilities
9. **suggestion_support**: Support/voting system for citizen suggestions with detailed tracking
10. **implementation_updates**: Progress tracking for implemented suggestions and policies

## Data Flow

### User Inquiry Flow
1. User fills out contact form on frontend
2. Form data validated with Zod schema
3. API call to `/api/inquiries` endpoint
4. Data stored in PostgreSQL via Drizzle ORM
5. Success confirmation returned to user

### AI Chat Flow
1. User opens chat dialog and sends message
2. Message sent to `/api/chat` endpoint with session ID
3. Server calls OpenAI API for response generation
4. Chat exchange stored in database
5. AI response returned to user interface

### Content Management
- Static content defined in TypeScript data files
- Candidate information, policies, and district details
- Internationalization ready with Korean language support

## External Dependencies

### Core Dependencies
- **OpenAI API**: AI chat functionality using GPT-4o model
- **Neon Database**: PostgreSQL hosting via `@neondatabase/serverless`
- **Radix UI**: Comprehensive component library
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the application
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds frontend, esbuild bundles backend
- **Deployment**: Autoscale deployment on port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static assets served from built frontend
4. Production server starts on configured port

## Changelog

- June 26, 2025. Initial setup
- June 26, 2025. Added PostgreSQL database integration with Drizzle ORM, replacing in-memory storage
- June 26, 2025. Integrated Google Analytics 4 with comprehensive event tracking for user interactions, policy views, AI chat usage, and document downloads
- June 26, 2025. Created comprehensive policy detail pages with individual routes, budget information, implementation timelines, and related policy suggestions
- June 26, 2025. Implemented comprehensive security features including input validation, XSS protection, SQL injection prevention, rate limiting, and performance monitoring
- June 26, 2025. Added comprehensive CMS functionality with content management, AI training document system, and speech training capabilities for enhanced AI responses
- June 26, 2025. Implemented citizen suggestion and feedback collection system with categorization, priority levels, support voting, moderation capabilities, and progress tracking accessible at /suggestions route
- June 26, 2025. Fixed UI visibility issues: enhanced button styling in Hero component, added admin and citizen suggestion navigation buttons, implemented functional contact and AI chat buttons in PolicyDetail page, added comprehensive error handling with user-friendly messages, resolved rate limiting issues (increased to 1000 requests/5 minutes)
- June 27, 2025. Removed population statistics overlay from homepage for cleaner interface
- June 27, 2025. Implemented comprehensive digital accessibility features for seniors and differently-abled users including font size adjustment, screen magnification, high contrast mode, text-to-speech, reduced motion, focus mode, keyboard navigation support, ARIA labels, and skip-to-content functionality
- June 27, 2025. Applied comprehensive deployment fixes for Cloud Run compatibility: added SESSION_SECRET environment variable auto-generation with enhanced validation, configured server to listen on 0.0.0.0 with proper port parsing, implemented robust error handling for missing environment variables with detailed logging, added comprehensive health check endpoint at /health with database connectivity testing and system monitoring, enhanced database connection with exponential backoff retry logic and graceful startup sequence, implemented graceful shutdown handling with database connection cleanup for production deployment, added readiness endpoint at /ready for container orchestration, enhanced OpenAI service with fallback handling for missing API keys
- June 28, 2025. Fixed candidate profile issues: enhanced Chinese character name display for candidate Lee Woo-kyu (李佑奎) with clearer formatting, resolved navigation bar "현황데이터" (status data) button functionality by adding proper section ID to EconomicImpactChart component, updated candidate photo to use actual profile image from attached assets, improved database query caching and network request optimization for better loading performance
- June 28, 2025. Comprehensive content and image update: replaced candidate profile photo with new campaign activity image (이우규-원본_1751090980969.JPG), updated all policy content with detailed implementation phases and expected outcomes from official campaign documents, replaced all district-level infographic images with new uploaded assets including DRT transportation, smart farm, medical welfare, energy development, and market development visuals, optimized image loading with CSS properties for better web performance

## User Preferences

Preferred communication style: Simple, everyday language.
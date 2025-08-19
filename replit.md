# SkillConnect

## Overview

SkillConnect is a comprehensive full-stack social learning platform that combines e-learning, job opportunities, professional networking, and social media features. The application is built as a modern web platform using React for the frontend and Express.js for the backend, with real-time features and a rich user experience centered around skill development, course management, job matching, and professional networking.

## User Preferences

Preferred communication style: Simple, everyday language.

Design preferences: Clean white and blue color scheme with no overriding of elements. Uses semantic color variables (background, foreground, primary, secondary, muted, etc.) for consistent theming.

## System Architecture

### Frontend Architecture
- **React SPA**: Single-page application built with React 18 and TypeScript
- **UI Framework**: Shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js Server**: RESTful API with TypeScript
- **Session Management**: Express session middleware with secure cookie configuration
- **Authentication**: BCrypt password hashing with session-based authentication
- **API Design**: RESTful endpoints organized by feature modules (auth, courses, jobs, posts, messages)
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development Tools**: Hot reload with Vite integration for seamless development

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Design**: 
  - Users table with role-based access (learner, instructor, employer, admin)
  - Courses with enrollment tracking and progress monitoring
  - Jobs with application management
  - Social features (posts, messages, user follows)
  - Financial transactions for payments and wallet management
- **Migrations**: Drizzle Kit for database schema migrations

### Key Features Implementation
- **E-Learning System**: Course creation, enrollment, progress tracking, and certification
- **Job Marketplace**: Job posting, application management, and skill-based matching
- **Social Networking**: User profiles, following system, posts, and messaging
- **Wallet System**: Integrated payment processing for course purchases and job payments
- **Real-time Features**: Live messaging and notifications

### Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Component Architecture**: Reusable UI components with consistent design system
- **Service Layer**: Storage abstraction layer for database operations
- **Middleware Pattern**: Express middleware for authentication, logging, and error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL ORM for database operations
- **bcrypt**: Password hashing for secure authentication
- **express-session**: Session management for user authentication
- **@tanstack/react-query**: Server state management and caching

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Dynamic CSS class generation
- **embla-carousel-react**: Carousel component for content display

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation and schema definition
- **wouter**: Lightweight client-side routing

### Optional Integrations
- **WebSocket support**: Ready for real-time messaging implementation
- **File upload services**: Configured for resume and course material uploads
- **Payment gateways**: Prepared for transaction processing integration
- **Email services**: Ready for notification and communication features
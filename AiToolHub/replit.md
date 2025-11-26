# AI Tools Hub

## Overview

AI Tools Hub is a web application that provides five distinct AI-powered productivity tools: PersonaFlow (chat with custom AI characters), AI Summarizer (extract key points from content), Blog Writer (convert content into blog posts), Flowchart Generator (visualize processes), and Course Generator (create learning roadmaps). The application uses a modern SaaS interface inspired by ChatGPT and Notion AI, with a focus on clarity and user-friendly design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server

**Routing**: Wouter for client-side routing with dedicated pages for each tool (Home, PersonaFlow, Summarizer, BlogWriter, Flowchart, CourseGenerator)

**UI Component Library**: Shadcn UI components built on Radix UI primitives with Tailwind CSS for styling. Components follow the "new-york" style variant with custom color system and spacing primitives defined in the design guidelines.

**State Management**: React Query (@tanstack/react-query) for server state management with custom query client configuration. Local component state using React hooks (useState, useRef, useEffect).

**Form Handling**: React Hook Form with Zod resolvers for schema validation

**Styling Approach**: Tailwind CSS with custom design tokens, utility-first CSS methodology, and responsive design (mobile-first with md/lg breakpoints). Custom CSS variables defined for colors, shadows, and spacing.

**Design System**: Typography uses Inter (primary) and JetBrains Mono (code/technical) from Google Fonts. Spacing uses Tailwind units (4, 6, 8, 12, 16, 24). Container widths vary by context (max-w-7xl for landing, max-w-4xl for forms, max-w-6xl for results).

### Backend Architecture

**Runtime**: Node.js with Express framework

**API Pattern**: RESTful API with JSON request/response bodies mounted at `/api/*` endpoints

**Development vs Production**: Separate entry points (index-dev.ts uses Vite middleware for HMR, index-prod.ts serves static files from dist/public)

**Request Handling**: Custom middleware for logging, JSON parsing with raw body preservation, URL-encoded form data support

**Error Handling**: Centralized error responses with proper HTTP status codes and JSON error messages

**Type Safety**: Shared TypeScript schemas between client and server using Zod for runtime validation

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map data structures (MemStorage class) for user data

**Database Configuration**: Drizzle ORM configured for PostgreSQL with Neon serverless driver. Schema defined in shared/schema.ts with migrations output to ./migrations directory.

**Database Provider**: Neon serverless PostgreSQL (configuration present but actual database usage may be added later)

**Schema Design**: User table with id, username fields defined. Application currently stores data in memory but has infrastructure for PostgreSQL persistence.

### Authentication and Authorization

**Current Status**: Basic user storage interface defined (IStorage with getUser, getUserByUsername, createUser methods) but authentication not actively implemented in the application flow

**Session Management**: Infrastructure present for connect-pg-simple sessions but not actively used

### External Dependencies

**AI Service**: OpenAI API (GPT-5 model) for all AI-powered features. API key required via OPENAI_API_KEY environment variable. Lazy initialization pattern - client only created when first needed.

**API Endpoints**:
- `/api/health` - Health check with OpenAI configuration status
- `/api/persona-flow/chat` - PersonaFlow character interactions
- `/api/summarizer` - Content summarization
- `/api/blog-writer` - Blog post generation
- `/api/flowchart` - Flowchart generation
- `/api/course-generator` - Course creation

**Visualization Library**: Mermaid.js (loaded from CDN) for flowchart rendering. Initialized with theme "default" and security level "loose".

**UI Component Dependencies**: Extensive use of Radix UI primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, radio-group, select, slider, switch, tabs, toast, tooltip, etc.)

**Development Tools**: Replit-specific plugins for error overlay, cartographer, and dev banner in development mode

**Font Loading**: Google Fonts for Inter, DM Sans, Fira Code, Geist Mono, and Architects Daughter fonts

**Build Tools**: ESBuild for server bundling, Vite for client bundling with React plugin and TypeScript support
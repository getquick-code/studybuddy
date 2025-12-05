# StudyBuddy - Exam Planner

## Overview

StudyBuddy is a student-focused exam planning and study task management application. It helps students organize their exams, create study schedules, track progress, and manage subtasks through an intuitive drag-and-drop interface. The application provides a visual monthly calendar view alongside a detailed daily task list, making it easy to plan and adjust study sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### December 1, 2025 - Help Page with Visual Walkthrough
- Created interactive Help page (`/help`) with step-by-step feature guide
- 8 animated walkthrough steps explaining all major features:
  - Calendar overview, adding exams, creating tasks, drag-and-drop, subtasks, progress tracking, results dashboard, templates
- Full translations in all 3 languages (Dutch, French, English)
- Framer Motion animations for smooth transitions between steps
- Feature overview grid at bottom with icons
- Help button added to both Landing page and Dashboard header

### December 1, 2025 - Role-Based System and Template Sharing
- Added Replit Auth integration with OAuth flow (Google/GitHub/email)
- Implemented role selection (student/teacher) for new users after first login
- Created template management system:
  - Teachers can create and share schedule templates
  - Students can browse and import public templates
- Added roleConfirmed boolean field to users table for reliable role persistence
- Updated all authenticated API calls with proper credentials
- Synchronous cache updates using queryClient.setQueryData for immediate UI updates

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Framework**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. The design system uses a playful, friendly aesthetic with custom fonts (Fredoka, Nunito, Outfit) and a light color scheme optimized for students.

**Routing**: wouter for lightweight client-side routing.

**State Management**: 
- TanStack Query (React Query) for server state management and data fetching
- Local React state for UI state
- Custom hooks for reusable logic (e.g., `useIsMobile`, `useToast`)

**Drag and Drop**: @dnd-kit libraries for implementing draggable study tasks and calendar interactions, allowing users to reorder tasks and move them between dates.

**Key Design Decisions**:
- Component-based architecture with reusable UI components in `client/src/components/ui/`
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)
- Custom Vite plugin (`vite-plugin-meta-images`) for dynamic OpenGraph image meta tag updates based on deployment environment
- Development tooling includes runtime error overlay and Replit-specific development banners

### Backend Architecture

**Framework**: Express.js server with TypeScript, using ESNext modules.

**API Design**: RESTful HTTP API with the following endpoints:
- `/api/exams` - CRUD operations for exams
- `/api/tasks` - CRUD operations for study tasks
- `/api/tasks/:id/move` - Specialized endpoint for moving tasks between dates
- `/api/subtasks` - CRUD operations for subtasks

**Data Layer**: 
- Storage abstraction through `IStorage` interface in `server/storage.ts`
- `DatabaseStorage` implementation using Drizzle ORM
- Separation of concerns between route handlers and data access

**Build Strategy**: Custom build script using esbuild for server bundling with selective dependency bundling (allowlist approach) to optimize cold start times by reducing file system syscalls. Client is built separately with Vite.

**Development Setup**: 
- Vite middleware mode for development with HMR
- Separate dev scripts for client and server
- Custom logging middleware for API request tracking

### Data Storage

**Database**: PostgreSQL via Neon serverless database with WebSocket support.

**ORM**: Drizzle ORM with the following schema:

**Tables**:
- `users` - User accounts (id, name, language, defaultSubtaskDuration, createdAt) - Simple name-based user identification with per-user language preference
- `exams` - Exam details (id, userId, subject, title, date, difficulty, description, understanding level, results) - User-scoped
- `studyTasks` - Study tasks linked to exams (id, userId, examId, title, date, completed, durationMinutes, orderIndex) - User-scoped
- `subTasks` - Subtasks within study tasks (id, taskId, title, completed, durationMinutes, orderIndex)

**User Management**:
- Simple name-based user creation (no password required for students)
- User picker dropdown in the header for easy switching
- All exams and tasks are scoped to the selected user
- New users automatically get seeded with sample exam data
- Selected user is persisted in localStorage

**Schema Design Decisions**:
- Foreign key constraints with cascade deletes to maintain referential integrity
- `orderIndex` fields for custom ordering of tasks and subtasks
- Date fields stored as PostgreSQL date type for accurate date comparisons
- Validation schemas using Zod via drizzle-zod for type-safe input validation

**Migration Strategy**: Drizzle Kit for schema migrations with migrations stored in `./migrations/` directory.

### External Dependencies

**Database Provider**: Neon Database (@neondatabase/serverless) - Serverless PostgreSQL with WebSocket support for low-latency connections.

**UI Component Library**: 
- Radix UI - Unstyled, accessible component primitives
- shadcn/ui - Pre-built component collection configured in `components.json`
- Tailwind CSS with custom theme configuration for styling

**Form Handling**: 
- react-hook-form with @hookform/resolvers for form state management
- Zod for schema validation

**Development Tools**:
- Replit-specific Vite plugins for development environment (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)
- TypeScript with strict mode enabled for type safety

**Utility Libraries**:
- date-fns with multi-locale support (nl, fr, enUS) for date manipulation and formatting
- uuid for unique identifier generation
- clsx and tailwind-merge for conditional class name handling
- nanoid for generating unique IDs

### Internationalization (i18n)

**Language Support**: Dutch (nl), French (fr), and English (en) - designed for Belgian secondary school students.

**Implementation**:
- Translation system in `client/src/lib/i18n.ts` with type-safe `Translations` interface
- `useLanguage` hook in `client/src/lib/useLanguage.tsx` for accessing translations and current language
- `LanguageProvider` context wrapping the app in `client/src/App.tsx`
- Language selector dropdown in header with flag-style indicators (NL/FR/EN)
- Language preference stored per user in database (users.language field)
- When switching users, the app loads that user's saved language preference
- When changing language, it's saved to the user's profile via API

**Translated Content**:
- All UI elements: headers, buttons, labels, forms, modals
- Subject names (all 23 Belgian secondary school subjects)
- Calendar weekday names and month formatting
- Results dashboard with charts and statistics
- Welcome screen and onboarding
- Error messages and notifications

**Date Localization**:
- `dateLocales` object maps language codes to date-fns locale objects
- All date formatting uses the active language's locale

**Build Tools**:
- Vite for frontend bundling
- esbuild for server bundling
- tsx for running TypeScript in Node.js during development
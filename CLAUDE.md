# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a streak tracking application with a full-stack architecture:

- **Frontend**: Nuxt 3 Vue.js application (`/frontend`)
- **Backend**: NestJS REST API (`/backend`)
- **Database**: MySQL with TypeORM

## Development Commands

### Frontend (Nuxt 3)
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
```

### Backend (NestJS)
```bash
cd backend
npm run start:dev    # Start development server with watch mode
npm run build        # Build for production
npm run start:prod   # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:cov     # Run tests with coverage
```

## Architecture Overview

### Backend Architecture
- **NestJS Framework**: Modular architecture with controllers, services, and modules
- **Database**: MySQL with TypeORM for entity management
- **Key Modules**:
  - `StreaksModule`: Core streak functionality
  - `DevToolsModule`: Development utilities (date simulation)
- **Entity**: `Streak` entity with `id` and `completion_date` fields
- **API Endpoints**:
  - `GET /streaks`: Fetch all streaks and current streak count
  - `POST /streaks`: Mark today as completed
  - `POST /streaks/reset`: Reset all streaks
  - `POST /streaks/undo-today`: Undo today's marking
  - `GET /dev-tools/current-date`: Get current/simulated date

### Frontend Architecture
- **Nuxt 3**: Vue.js framework with SSR capabilities
- **State Management**: Pinia store (`stores/streaks.ts`)
- **Styling**: Tailwind CSS for responsive design
- **Components**:
  - `StreakCalendar.vue`: Visual calendar showing streak history
  - `FlameIcon.vue`: Fire icon for active streaks
  - `DevTools.vue`: Development utilities
- **Animation**: Lottie animations for visual effects
- **API Proxy**: Configured to proxy `/api/*` to backend at `http://localhost:3000`

### Key Features
- **Streak Tracking**: Mark daily completions and calculate consecutive streaks
- **Visual Calendar**: Shows streak history with visual indicators
- **Date Simulation**: Development tool for testing different dates
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

## Environment Configuration

### Backend Environment Variables
```
DATABASE_HOST=localhost
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=streak_tracker
PORT=3000
```

### Frontend Environment Variables
```
API_URL=http://localhost:3000  # Backend API URL
```

## Database Schema

### Streaks Table
- `id`: Primary key (auto-increment)
- `completion_date`: Date field storing when streak was completed

## Development Notes

- Backend runs on port 3000 by default
- Frontend development server proxies API calls to backend
- TypeORM is configured with `synchronize: true` for development (be cautious in production)
- The application includes dev tools for date simulation to test streak functionality
- Uses MySQL2 driver for database connectivity
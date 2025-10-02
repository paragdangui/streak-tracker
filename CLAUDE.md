# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a streak tracking application with a full-stack architecture:

- **Frontend**: Nuxt 4 Vue.js application (`/frontend`)
- **Backend**: NestJS REST API (`/backend`)
- **Database**: MySQL with TypeORM
- **Deployment**: Docker Compose for containerized deployment

## Development Commands

### Frontend (Nuxt 4)
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

### Docker Deployment
```bash
docker compose up    # Start all services (backend, frontend, database)
docker compose down  # Stop all services
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
  - `POST /dev-tools/set-date`: Set simulated date
  - `POST /dev-tools/reset-date`: Reset to real current date

### Frontend Architecture
- **Nuxt 4**: Vue.js framework with SSR capabilities (client-side rendering for streak data)
- **State Management**: Pinia store (`stores/streaks.ts`)
- **Styling**: Tailwind CSS for responsive design
- **Components**:
  - `StreakCalendar.vue`: Visual calendar with month and year views
  - `DevTools.vue`: Development utilities (date simulation, data reset)
  - `icons/ChevronLeft.vue`: Left chevron icon component
  - `icons/ChevronRight.vue`: Right chevron icon component
- **Animation**: Lottie animations (@lottiefiles/dotlottie-vue) for visual effects
- **API Proxy**: Configured to proxy `/api/*` to backend at `http://localhost:3000`

### Key Features
- **Streak Tracking**: Mark daily completions and calculate consecutive streaks
- **Visual Calendar**:
  - Month view with continuous streak highlighting
  - Year view showing all 12 months with completion indicators
  - Week starts on Monday (not Sunday)
  - Today indicator with border highlighting
  - Tooltip with date information
  - Navigation constraints (can't navigate to future months)
- **Date Simulation**: Development tool for testing different dates (visible in dev mode)
- **Simulation Mode Indicator**: Yellow "SIMULATION MODE" header when using simulated dates
- **Responsive UI**: Mobile-friendly design with Tailwind CSS
- **Client-Side Rendering**: Data fetching happens client-side to avoid hydration issues

### Docker Configuration
- **Backend**: Runs on port 8001 (mapped from container port 3000)
- **Frontend**: Runs on port 8080 (mapped from container port 3000)
- **Database**: MySQL 8.0 on port 3308 (mapped from container port 3306)
- **Volumes**: Persistent data storage for MySQL and hot-reload for development
- **Health Checks**: Database health checks ensure backend starts after DB is ready

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

### Docker Environment Variables
Backend and frontend use environment variables defined in docker-compose.yml:
- Database connection to `db` service
- Frontend API URL points to `backend` service

## Database Schema

### Streaks Table
- `id`: Primary key (auto-increment)
- `completion_date`: Date field storing when streak was completed

## Development Notes

- Backend runs on port 3000 by default (8001 in Docker)
- Frontend development server proxies API calls to backend
- Frontend runs on port 3000 by default (8080 in Docker)
- TypeORM is configured with `synchronize: true` for development (be cautious in production)
- The application includes dev tools for date simulation to test streak functionality
- Uses MySQL2 driver for database connectivity
- Vue script sections are placed at the top of .vue files
- All SVG icons are extracted into separate Vue components in `components/icons/`
- Calendar week starts on Monday instead of Sunday
- Year view added for viewing entire year at a glance
- Tailwind CSS configuration is in `frontend/tailwind.config.js`
- Client-side rendering used to avoid hydration issues between server and client
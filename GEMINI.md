# Project Overview

This is a full-stack web application designed to track streaks. It consists of a Nuxt.js frontend and a NestJS backend. The entire application is containerized using Docker for easy local development.

## Technologies

*   **Frontend:** Nuxt.js 4, Vue 3, Pinia for state management, and Tailwind CSS for styling.
*   **Backend:** NestJS, TypeORM, and MySQL for the database.
*   **DevOps:** Docker and Docker Compose.

# Building and Running

The application is orchestrated using Docker Compose.

**To build and run the application:**

```bash
docker-compose up --build
```

This will start the following services:

*   **frontend:** Accessible at [http://localhost:8080](http://localhost:8080)
*   **backend:** Accessible at [http://localhost:8001](http://localhost:8001)
*   **db:** A MySQL database running on port 3308.

**To stop the application:**

```bash
docker-compose down
```

## Development Conventions

### Backend (NestJS)

*   **API:** The backend follows the principles of RESTful APIs.
*   **Database:** The project uses TypeORM to interact with the MySQL database.
*   **Scripts:**
    *   `npm run start:dev`: Starts the backend in development mode with file watching.
    *   `npm run build`: Builds the application for production.
    *   `npm run test`: Runs unit tests.
    *   `npm run lint`: Lints the codebase.

### Frontend (Nuxt.js)

*   **Component-Based:** The frontend is built using Vue 3 components.
*   **State Management:** Pinia is used for centralized state management.
*   **Styling:** Tailwind CSS is used for styling.
*   **Scripts:**
    *   `npm run dev`: Starts the frontend in development mode.
    *   `npm run build`: Builds the application for production.
    *   `npm run generate`: Generates a static site.

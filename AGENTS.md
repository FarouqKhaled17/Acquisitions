# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js/Express API for an acquisitions system with user authentication. The project uses:
- Express.js with ES modules
- Drizzle ORM with Neon PostgreSQL
- Zod for validation
- JWT for authentication
- Winston for logging
- bcrypt for password hashing

## Development Commands

### Core Development
- `npm run dev` - Start development server with file watching
- `npm run lint` - Check code style with ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format-check` - Check if code is properly formatted

### Database Operations
- `npm run db:generate` - Generate Drizzle migrations from schema
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:pull` - Pull schema from database
- `npm run db:studio` - Open Drizzle Studio for database GUI

## Architecture

### Module System
The project uses ES modules with custom import paths defined in package.json:
- `#config/*` → `./src/config/*.js`
- `#controllers/*` → `./src/controllers/*.js`
- `#models/*` → `./src/models/*.js`
- `#services/*` → `./src/services/*.js`
- `#utils/*` → `./src/utils/*.js`
- `#validations/*` → `./src/validations/*.js`
- `#routes/*` → `./src/routes/*.js`
- `#middlewares/*` → `./src/middlewares/*.js`

### Application Structure
- `src/index.js` - Entry point that loads environment and starts server
- `src/servers.js` - HTTP server configuration
- `src/app.js` - Express app setup with middleware and routes
- `src/config/` - Database connection and logging configuration
- `src/models/` - Drizzle ORM schema definitions
- `src/controllers/` - Request handlers with validation
- `src/services/` - Business logic layer
- `src/routes/` - Express route definitions
- `src/validations/` - Zod schemas for request validation
- `src/utils/` - Utility functions (JWT, cookies, formatting)

### Data Flow Pattern
1. Routes define endpoints and attach controllers
2. Controllers validate input using Zod schemas from validations/
3. Controllers call services for business logic
4. Services interact with database through models/
5. Responses are formatted and logged

### Database Integration
- Uses Drizzle ORM with Neon PostgreSQL serverless
- Schema defined in `src/models/` using Drizzle syntax
- Database configuration in `src/config/database.js`
- Migrations managed through drizzle-kit commands

### Error Handling & Logging
- Uses `express-async-handler` for async error handling
- Winston logger configured in `src/config/logger.js`
- Logs to files (`logs/error.log`, `logs/combined.log`) and console in development
- Custom error formatting for validation errors in `src/utils/format.js`

### Authentication System
- JWT-based authentication with configurable expiration
- Password hashing with bcrypt (10 rounds)
- Cookie-based token storage
- Role-based access (user/admin roles)

## Environment Setup

Required environment variables (see `.env.example`):
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level (default: info)
- `DB_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing

## Code Style

- ESLint configuration enforces 2-space indentation, single quotes, semicolons
- Prettier formats with trailing commas (es5), single quotes, 80 character width
- Use arrow functions and const/let (no var)
- Unused parameters should be prefixed with underscore
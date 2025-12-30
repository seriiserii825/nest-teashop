# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS e-commerce API (teashop) with PostgreSQL database, JWT authentication, and Swagger documentation. Requires Node.js 22.

## Common Commands

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debugger

# Build & Production
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled app

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test -- --testNamePattern="pattern"  # Run specific test
npm run test:e2e           # Run e2e tests
npm run test:cov           # Test coverage

# Code Quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier format

# Database Migrations (TypeORM)
npm run migration:generate  # Generate migration from entity changes
npm run migration:run       # Apply pending migrations
npm run migration:revert    # Rollback last migration
npm run migration:show      # List migrations status
```

## Architecture

### Module Structure
- **AuthModule** - JWT authentication with Google/Yandex OAuth, issues access (15m) and refresh (7d) tokens
- **UserModule** - User CRUD, password hashing with argon2
- **StoreModule** - Multi-tenant stores, each user can own multiple stores
- **ProductModule** - Products belong to stores, have categories and colors

### Entity Relationships
```
User → Store → Product → OrderItem ← Order ← User
         ↓        ↓
      Category   Color
         ↓
       Review
```

Users can favorite products (many-to-many via `user_favorites` table).

### Key Patterns

**Authentication decorator** - Use `@Auth()` to protect routes:
```typescript
@Auth()
@Get('profile')
getProfile(@CurrentUser() user: User) {}
```

**CurrentUser decorator** - Extracts user from JWT:
```typescript
@CurrentUser('id') userId: string  // Get specific field
@CurrentUser() user: User          // Get full user object
```

### Configuration
- Database config: `src/config/data-source.ts`
- JWT config: `src/config/jwt.config.ts`
- Entities pattern: `src/**/*.entity.ts`
- Migrations: `src/migrations/`

### API Documentation
Swagger UI available at `/docs` endpoint when server is running.

## Environment Variables

Required in `.env`:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL
- `JWT_SECRET` - Token signing
- `CLIENT_URL` - CORS origin
- `SERVER_DOMAIN` - Cookie domain
- `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`, `GOOGLE_CALLBACK_URL` - OAuth

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development servers (both frontend and backend)
npm start

# Alternative: run frontend and backend separately
npm run dev:frontend  # Vite frontend
npm run dev:backend   # Convex backend

# Initial Convex setup (runs automatically before dev)
npm run predev
```

### Build & Quality
```bash
# Build the project
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Preview production build
npm run preview
```

### Stripe Webhook (Development)
```bash
# Listen for Stripe webhook events locally
stripe listen --forward-to localhost:5173/stripe/webhook
```

## Architecture Overview

### Tech Stack
- **Frontend**: React + Vite + TanStack Router
- **Backend**: Convex (serverless functions with real-time sync)
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: Convex Auth with email OTP and social logins
- **Payments**: Stripe subscriptions
- **Email**: Resend + React Email
- **Forms**: TanStack Form with Zod validation
- **i18n**: react-i18next

### Project Structure

```
src/
├── routes/          # TanStack Router file-based routing
│   ├── _app/       # Authenticated app routes
│   │   ├── _auth/  # Protected routes (dashboard, onboarding)
│   │   └── login/  # Authentication pages
│   └── index.tsx   # Landing page
├── ui/             # Reusable UI components
├── utils/          # Utilities and validators
└── router.tsx      # Router configuration

convex/
├── auth.ts         # Authentication logic
├── stripe.ts       # Stripe integration
├── schema.ts       # Database schema (users, plans, subscriptions)
├── email/          # Email templates
└── otp/           # One-time password logic
```

### Key Concepts

1. **Authentication Flow**: 
   - Uses Convex Auth with OTP email verification
   - Social logins supported
   - Protected routes under `_app/_auth`

2. **Database Schema**:
   - `users`: User profiles with Stripe customer IDs
   - `plans`: Subscription plans (Free, Pro)
   - `subscriptions`: Active user subscriptions

3. **Routing**: 
   - File-based routing with TanStack Router
   - Layout routes for shared UI
   - Route protection via authentication checks

4. **Convex Functions**:
   - Queries and mutations in `/convex` directory
   - Real-time subscriptions supported
   - Type-safe API generation

5. **Environment Variables** (set via `npx convex env set`):
   - `AUTH_RESEND_KEY`: Resend API key for emails
   - `STRIPE_SECRET_KEY`: Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Webhook signing secret

### Development Workflow

1. Convex functions auto-reload on save
2. Vite provides HMR for frontend changes
3. TypeScript types are generated from Convex schema
4. Stripe webhooks must be forwarded locally using Stripe CLI

## Convex Backend Guidelines

**IMPORTANT**: The entire backend is built on Convex. For detailed Convex development guidelines, best practices, and examples, refer to:
- `agent_docs/convex.txt` - Comprehensive Convex guidelines including:
  - Function syntax and registration patterns
  - Schema design and validators
  - Query optimization with indexes
  - TypeScript patterns for Convex
  - Real-world examples

Always consult this file when working with Convex functions, schemas, or database operations.

## Email Service Guidelines

**Resend** is our email service provider for all email functionality. For detailed documentation and API references, consult:
- `agent_docs/resend.txt` - Complete Resend documentation including:
  - One-time password (OTP) email delivery
  - Transactional email sending
  - Marketing email campaigns and broadcasts
  - Email templates with React Email
  - Webhook event handling
  - Domain verification and deliverability

This service handles authentication emails, subscription notifications, and any future marketing campaigns.

## Payment Processing Guidelines

**Stripe** is our payment provider for subscriptions and billing. For comprehensive documentation and integration guidance, refer to:
- `agent_docs/stripe.txt` - Full Stripe documentation covering:
  - Stripe Checkout for subscription payments
  - Billing and subscription management
  - Webhook handling for payment events
  - Customer portal for self-service
  - Payment method management
  - Invoice generation and management
  - Testing with test cards and keys

Stripe handles all payment processing, subscription lifecycle management, and billing operations.
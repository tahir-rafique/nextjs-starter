# Next.js Full-Stack Boilerplate — CLAUDE.md

## Project Overview
Production-ready Next.js 15 boilerplate with App Router, TypeScript, Tailwind CSS,
shadcn/ui, Redux Toolkit, Context API, MongoDB Atlas, NextAuth.js, Jest/RTL, and Vercel deployment.

## Core Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 + shadcn/ui (Radix primitives)
- **State**: Redux Toolkit (global/server state) + Context API (auth/UI state)
- **Database**: MongoDB Atlas via Mongoose v8
- **Auth**: NextAuth.js v4 (Credentials + Google + GitHub OAuth)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest 29 + React Testing Library + MSW (API mocking)
- **Deployment**: Vercel

## Folder Structure
```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth route group (login, register)
│   ├── (dashboard)/         # Protected route group
│   ├── api/                 # Route Handlers
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── auth/register/        # Registration endpoint
│   │   ├── users/[id]/           # User CRUD
│   │   └── health/               # Health check
│   ├── layout.tsx           # Root layout with all providers + SEO metadata
│   ├── robots.ts            # /robots.txt
│   └── sitemap.ts           # /sitemap.xml
├── components/
│   ├── common/              # Header, Footer, Sidebar, Navbar
│   ├── forms/               # LoginForm, RegisterForm
│   ├── providers/           # AppProviders, ReduxProvider
│   └── ui/                  # shadcn/ui components (install via CLI)
├── context/                 # AuthContext, UIContext
├── hooks/                   # useDebounce, useLocalStorage, usePagination, useAsync, ...
├── lib/                     # db.ts, auth.ts, utils.ts, validations.ts, api-response.ts
├── models/                  # Mongoose models (User)
├── store/                   # Redux store + slices (auth, ui, users)
├── types/                   # TypeScript types (api.ts, auth.ts, user.ts)
└── __tests__/               # Jest tests (components, hooks, lib, api)
```

## Key Conventions
- **API responses**: always use helpers from `src/lib/api-response.ts` — never write raw `NextResponse.json()`
- **DB connection**: always call `await connectDB()` at the top of every Route Handler
- **Auth guard**: server components call `getServerSession(authOptions)` and `redirect()`; client components use `useAuth()`
- **Type imports**: use `import type { ... }` for type-only imports (enforced by ESLint)
- **Aliases**: `@/*` = `src/*` — never use relative `../../` imports
- **State management**: use Redux Toolkit slices for server/async data; use Context API for auth session and UI ephemeral state
- **Forms**: always use `react-hook-form` + Zod schema via `zodResolver`
- **Validation**: define Zod schemas in `src/lib/validations.ts`; share between client and API routes
- **Environment variables**: all secret keys stay server-side only; prefix with `NEXT_PUBLIC_` only for client-safe values

## Environment Setup
```bash
cp .env.example .env.local
# Fill in MONGODB_URI, NEXTAUTH_SECRET, etc.
npm install
npm run dev
```

## Common Commands
```bash
npm run dev           # Development server
npm run build         # Production build
npm run lint          # ESLint check
npm run type-check    # TypeScript check
npm test              # Run all tests
npm run test:coverage # Coverage report
```

## Adding a New Feature (checklist)
1. Add Zod schema to `src/lib/validations.ts`
2. Add TypeScript types to `src/types/`
3. Create/update Mongoose model in `src/models/`
4. Create Route Handler in `src/app/api/<resource>/route.ts`
5. Add Redux slice in `src/store/slices/`
6. Build UI components in `src/components/`
7. Write tests in `src/__ tests__/`

## Adding shadcn/ui components
```bash
npx shadcn@latest add button
npx shadcn@latest add input card dialog toast ...
```
Components will be placed in `src/components/ui/`.

## Deployment (Vercel)
1. Push to GitHub
2. Import project in Vercel dashboard
3. Set all env variables from `.env.example`
4. Deploy — zero config needed (vercel.json is pre-configured)

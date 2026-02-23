# Interview Preview - Project Guide

## Tech Stack
- **Framework:** Next.js 14.2.35 (App Router), React 18, TypeScript 5
- **Styling:** Tailwind CSS 3.4.1 with custom theme (parchment/paper/ink/accent colors, Playfair Display + DM Sans fonts)
- **Database:** Supabase (PostgreSQL with RLS)
- **Auth:** Supabase Auth (email/password)
- **AI:** Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`) via `@anthropic-ai/sdk`
- **Payments:** Stripe (checkout sessions + webhooks)
- **Path alias:** `@/*` → `./src/*`

## Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, Header/Footer)
│   ├── globals.css
│   ├── login/page.tsx              # Email/password login
│   ├── signup/page.tsx             # Email/password signup
│   ├── pricing/page.tsx            # Free/Pro tiers, Stripe checkout
│   ├── setup/page.tsx              # 5-step interview setup wizard
│   ├── interview/page.tsx          # Conduct interview (answer questions, timer, follow-ups)
│   ├── scorecard/page.tsx          # Display results, save option
│   ├── dashboard/page.tsx          # Past interviews, stats (auth required)
│   └── api/
│       ├── interview/route.ts      # Question generation, evaluation, follow-ups
│       ├── scorecard/route.ts      # Save interview + scorecard to DB
│       └── stripe/
│           ├── checkout/route.ts   # Create Stripe checkout session
│           └── webhook/route.ts    # Handle Stripe subscription events
├── components/
│   ├── layout/ (Header.tsx, Footer.tsx)
│   └── ui/ (Button.tsx, Card.tsx, Input.tsx, ProgressBar.tsx, ScoreBar.tsx)
└── lib/
    ├── anthropic.ts                # Claude client init
    ├── supabase.ts                 # Supabase client init
    ├── stripe.ts                   # Stripe client init
    └── utils.ts                    # Utility functions
```

## Database Schema (supabase-schema.sql)
- **interviews**: id, user_id, role, job_description, cv_summary, weak_area, difficulty, questions (JSONB), answers (JSONB), created_at
- **scorecards**: id, interview_id (FK), user_id, overall_score (0-100), verdict, dimensions (JSONB), one_thing_to_fix, question_breakdown (JSONB), created_at
- **subscriptions**: id, user_id (unique), stripe_customer_id, stripe_subscription_id, plan (default 'free'), status (default 'active'), created_at
- All tables have RLS: users can only access their own rows

## API Routes

### POST /api/interview
Three actions via `action` field in request body:
- **`generate_questions`**: Takes role, jobDescription, cvSummary, weakArea, difficulty → returns `{ questions: string[] }` (8 questions)
- **`evaluate`**: Takes questions + answers → returns scorecard object with overall_score, verdict, dimensions (4), one_thing_to_fix, question_breakdown
- **`follow_up`**: Takes question, answer, difficulty → returns `{ follow_up: string | null }` (Hard/Brutal only)

### POST /api/scorecard
- Auth required (Bearer token)
- Saves interview + scorecard to DB, returns `{ success, interviewId }`

### POST /api/stripe/checkout
- Auth required → creates Stripe checkout session → returns `{ url }`

### POST /api/stripe/webhook
- Handles: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- Updates subscriptions table accordingly

## Core App Flow
1. `/setup` → 5-step wizard (role, job description, CV, weak area, difficulty) → saved to sessionStorage as `interviewSetup`
2. `/interview` → reads setup from sessionStorage → calls generate_questions API → user answers sequentially with timer → follow-ups on Hard/Brutal → calls evaluate API
3. `/scorecard` → displays results from sessionStorage `interviewData` → save button (redirects to login if unauthenticated)
4. `/dashboard` → auth required → shows past interviews, stats, upgrade link

## State Management
- React hooks (useState, useEffect, useCallback) for component state
- **sessionStorage keys:** `interviewSetup`, `interviewData`, `pendingSave`
- Supabase manages auth state

## Scoring System
- 4 dimensions (0-100): Evidence & Specificity, Handling Pressure, Self-Awareness, Strategic Thinking
- Average answers score 55-65 (intentionally no inflation)
- Per-question breakdown with score + note

## Difficulty Levels
- **Comfortable (~)**: Supportive, light pressure
- **Realistic (=)**: Standard professional pace
- **Hard (!)**: Probing, exposes weak areas
- **Brutal (!!)**: Aggressive follow-ups, no concessions

## Business Model
- **Free**: 3 interviews/month, all difficulties, last 3 visible in dashboard
- **Pro ($9.99/mo)**: Unlimited interviews, CV personalization, full history, score trends

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

## Design System (tailwind.config.ts)
- Colors: parchment (#F5F0E8), paper (#FDFAF4), ink (#1A1A1A), accent (#8B6914)
- Fonts: Playfair Display (display), DM Sans (body), DM Mono (mono)
- Border radius: card (12px), btn (8px)

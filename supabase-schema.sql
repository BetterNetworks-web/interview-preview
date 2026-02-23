-- InterviewPreview Database Schema
-- Run this in your Supabase SQL editor

-- Interviews table
create table if not exists interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null,
  job_description text,
  cv_summary text,
  weak_area text,
  difficulty text not null default 'realistic',
  questions jsonb not null default '[]',
  answers jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Scorecards table
create table if not exists scorecards (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references interviews(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  overall_score integer not null,
  verdict text,
  dimensions jsonb,
  one_thing_to_fix text,
  question_breakdown jsonb,
  created_at timestamptz default now()
);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free',
  status text not null default 'active',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_interviews_user_id on interviews(user_id);
create index if not exists idx_scorecards_user_id on scorecards(user_id);
create index if not exists idx_scorecards_interview_id on scorecards(interview_id);
create index if not exists idx_subscriptions_user_id on subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer_id on subscriptions(stripe_customer_id);

-- Row Level Security
alter table interviews enable row level security;
alter table scorecards enable row level security;
alter table subscriptions enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own interviews"
  on interviews for select
  using (auth.uid() = user_id);

create policy "Users can insert own interviews"
  on interviews for insert
  with check (auth.uid() = user_id);

create policy "Users can view own scorecards"
  on scorecards for select
  using (auth.uid() = user_id);

create policy "Users can insert own scorecards"
  on scorecards for insert
  with check (auth.uid() = user_id);

create policy "Users can view own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on subscriptions for all
  using (true)
  with check (true);

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  phone text check (phone is null or char_length(trim(phone)) > 0),
  stage text not null default 'Not contacted' check (
    stage in (
      'Not contacted',
      'Video sent',
      'First call',
      'Follow up call',
      'Meeting booked',
      'Personal Meet',
      'Proposal sent',
      'Finalization'
    )
  ),
  priority text not null default 'mid' check (priority in ('high', 'mid', 'low')),
  note text,
  is_done boolean not null default false,
  follow_up_date date,
  created_date date not null default current_date,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_date_idx on public.leads (created_date desc);
create index if not exists leads_follow_up_date_idx on public.leads (follow_up_date);
create index if not exists leads_stage_idx on public.leads (stage);
create index if not exists leads_priority_idx on public.leads (priority);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;

create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;

drop policy if exists "Anyone can read leads" on public.leads;
drop policy if exists "Anyone can create leads" on public.leads;
drop policy if exists "Anyone can update leads" on public.leads;

create policy "Anyone can read leads"
on public.leads
for select
to anon, authenticated
using (true);

create policy "Anyone can create leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "Anyone can update leads"
on public.leads
for update
to anon, authenticated
using (true)
with check (true);

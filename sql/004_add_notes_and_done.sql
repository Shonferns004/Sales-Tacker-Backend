alter table public.leads
add column if not exists note text;

alter table public.leads
add column if not exists is_done boolean not null default false;

alter table public.leads
alter column phone drop not null;

alter table public.leads
drop constraint if exists leads_phone_check;

alter table public.leads
add constraint leads_phone_check
check (phone is null or char_length(trim(phone)) > 0);

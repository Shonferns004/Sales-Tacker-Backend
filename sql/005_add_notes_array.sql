-- Add JSONB notes column for multiple notes per lead
alter table public.leads
add column if not exists notes jsonb not null default '[]'::jsonb;

-- Migrate existing single note to the new array format
update public.leads
set notes = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid(),
    'text', note,
    'createdAt', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  )
)
where note is not null and note != ''
  and (notes is null or notes = '[]'::jsonb);

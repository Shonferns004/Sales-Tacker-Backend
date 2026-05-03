insert into public.leads (name, phone, stage, priority, follow_up_date, created_date)
values
  ('Aarav Sharma', '+91 98765 43210', 'Not contacted', 'high', current_date, current_date),
  ('Meera Iyer', '+91 99887 76655', 'Proposal sent', 'mid', current_date + interval '2 days', current_date - interval '4 days'),
  ('Rohan Mehta', '+91 91234 56789', 'Follow up call', 'low', current_date - interval '1 day', current_date - interval '8 days')
on conflict do nothing;

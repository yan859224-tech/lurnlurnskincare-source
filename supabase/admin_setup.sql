-- Run in Supabase SQL Editor AFTER registering Admin with Supabase Auth.
-- 1. Confirm the registered account email in Supabase Authentication → Users.
-- 2. The final INSERT in this script grants admin to the matching email's auth.users ID.
-- SECURITY: Never expose a service_role key in frontend environment variables.

create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon;
grant select on public.admin_users to authenticated;
create policy "Users can check only their own admin role"
 on public.admin_users for select to authenticated using ((select auth.uid()) = user_id);
-- No browser INSERT/UPDATE/DELETE policies. Only trusted dashboard/SQL owner can grant roles.

create table if not exists public.store_product_overrides (
 product_id bigint primary key,
 price numeric(12,2) not null check(price>0),
 stock integer not null default 0 check(stock>=0),
 active boolean not null default true,
 updated_at timestamptz not null default now()
);
alter table public.store_product_overrides enable row level security;
grant select on public.store_product_overrides to anon,authenticated;
grant insert,update on public.store_product_overrides to authenticated;
create policy "Visitors can see product overrides"
 on public.store_product_overrides for select to anon,authenticated using (true);
create policy "Admin can add overrides"
 on public.store_product_overrides for insert to authenticated
 with check (exists(select 1 from public.admin_users where user_id=(select auth.uid())));
create policy "Admin can edit overrides"
 on public.store_product_overrides for update to authenticated
 using (exists(select 1 from public.admin_users where user_id=(select auth.uid())))
 with check (exists(select 1 from public.admin_users where user_id=(select auth.uid())));

create table if not exists public.store_settings (
 key text primary key,
 value text not null default '',
 updated_at timestamptz not null default now()
);
alter table public.store_settings enable row level security;
grant select on public.store_settings to anon,authenticated;
grant insert,update on public.store_settings to authenticated;
create policy "Visitors can read public settings"
 on public.store_settings for select to anon,authenticated using (key in ('telegram'));
create policy "Admin can insert public settings"
 on public.store_settings for insert to authenticated
 with check (key in ('telegram') and exists(select 1 from public.admin_users where user_id=(select auth.uid())));
create policy "Admin can edit public settings"
 on public.store_settings for update to authenticated
 using (key in ('telegram') and exists(select 1 from public.admin_users where user_id=(select auth.uid())))
 with check (key in ('telegram') and exists(select 1 from public.admin_users where user_id=(select auth.uid())));

-- Grant admin by a *real authenticated user ID*, never via a frontend email string.
-- Use this only after the email owner has registered and confirmed their email.
insert into public.admin_users(user_id)
select id from auth.users
where lower(email) = 'bunyanban20@gmail.com'
  and email_confirmed_at is not null
on conflict (user_id) do nothing;

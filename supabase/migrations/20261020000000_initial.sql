create extension if not exists pgcrypto;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  category text not null check (char_length(category) between 2 and 60),
  condition text not null check (condition in ('novo','seminovo','usado')),
  price_cents integer not null check (price_cents between 100 and 100000000),
  description text not null default '' check (char_length(description) <= 4000),
  photo_paths text[] not null default '{}',
  status text not null default 'rascunho' check (status in ('rascunho','publicado','vendido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint max_photos check (cardinality(photo_paths) <= 4)
);
create index products_user_updated on public.products(user_id, updated_at desc);
alter table public.products enable row level security;
create policy products_owner on public.products for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create table public.channel_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  channel text not null check (channel in ('facebook','olx','mercado_livre')),
  status text not null default 'rascunho' check (status in ('rascunho','publicado')),
  external_url text,
  confirmed_at timestamptz,
  unique(product_id, channel)
);
alter table public.channel_listings enable row level security;
create policy listings_owner on public.channel_listings for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (select 1 from public.products p where p.id = product_id and p.user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-photos', 'product-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy photo_owner_select on storage.objects for select to authenticated using (bucket_id = 'product-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy photo_owner_insert on storage.objects for insert to authenticated with check (bucket_id = 'product-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy photo_owner_delete on storage.objects for delete to authenticated using (bucket_id = 'product-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  month_key text not null,
  status text not null check (status in ('reserved','completed')),
  created_at timestamptz not null default now()
);
create index ai_usage_user_month on public.ai_usage(user_id, month_key, status);
alter table public.ai_usage enable row level security;
create policy usage_read on public.ai_usage for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.reserve_ai_generation(p_product_id uuid, p_month_key text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_id uuid;
begin
  if v_user is null or not exists (select 1 from public.products where id = p_product_id and user_id = v_user) then raise exception 'Produto não encontrado'; end if;
  if p_month_key !~ '^[0-9]{4}-[0-9]{2}$' then raise exception 'Mês inválido'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_user::text || p_month_key, 0));
  delete from public.ai_usage where user_id = v_user and status = 'reserved' and created_at < now() - interval '5 minutes';
  if (select count(*) from public.ai_usage where user_id = v_user and month_key = p_month_key and status in ('reserved','completed')) >= 5 then raise exception 'Limite de IA do mês atingido'; end if;
  insert into public.ai_usage(user_id, product_id, month_key, status) values (v_user, p_product_id, p_month_key, 'reserved') returning id into v_id;
  return v_id;
end $$;
revoke all on function public.reserve_ai_generation(uuid,text) from public;
grant execute on function public.reserve_ai_generation(uuid,text) to authenticated;

create or replace function public.finish_ai_generation(p_usage_id uuid, p_user_id uuid, p_success boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_success then update public.ai_usage set status = 'completed' where id = p_usage_id and user_id = p_user_id and status = 'reserved';
  else delete from public.ai_usage where id = p_usage_id and user_id = p_user_id and status = 'reserved'; end if;
end $$;
revoke all on function public.finish_ai_generation(uuid,uuid,boolean) from public;
grant execute on function public.finish_ai_generation(uuid,uuid,boolean) to service_role;

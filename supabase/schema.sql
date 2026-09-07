-- Vitorino Vitrines — estrutura do banco (rode no SQL Editor do seu Supabase)
-- Versão 1 — produtos + mídias (fotos e vídeos)

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null default 0,
  category text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Versão 2 — vários arquivos por produto e tamanhos
alter table public.products add column if not exists media jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists sizes text[] not null default '{}';

-- Acesso pela API (obrigatório no Supabase)
grant select, insert, update, delete on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

drop policy if exists "Permitir leitura pública dos produtos" on public.products;
create policy "Permitir leitura pública dos produtos"
  on public.products for select
  using (true);

drop policy if exists "Permitir inserção e gerenciamento de produtos" on public.products;
create policy "Permitir inserção e gerenciamento de produtos"
  on public.products for all
  using (true)
  with check (true);

-- Armazenamento das fotos e vídeos
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

drop policy if exists "Acesso público às mídias dos produtos" on storage.objects;
create policy "Acesso público às mídias dos produtos"
  on storage.objects for select
  using (bucket_id = 'product-media');

drop policy if exists "Upload público de mídias" on storage.objects;
create policy "Upload público de mídias"
  on storage.objects for insert
  with check (bucket_id = 'product-media');

drop policy if exists "Remover mídias dos produtos" on storage.objects;
create policy "Remover mídias dos produtos"
  on storage.objects for delete
  using (bucket_id = 'product-media');

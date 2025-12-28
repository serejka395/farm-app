-- Create the table for storing user data
create table if not exists users (
  wallet_address text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table users enable row level security;

-- Create policies to allow public access (simplest for now)
create policy "Public Select" on users
  for select using (true);

create policy "Public Insert" on users
  for insert with check (true);

create policy "Public Update" on users
  for update using (true);

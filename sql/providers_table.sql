create table providers (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add initial data
insert into providers (name) values 
  -- ('AWS'),
  -- ('Azure'),
  -- ('GCP'),
  -- ('Oracle Cloud'),
  -- ('Alibaba');
  -- ('DigitalOcean'),
  -- ('Linode'),
  -- ('IBM Cloud'),
  -- ('Heroku');

-- Allow anyone to read providers
create policy "Anyone can read providers"
on providers for select
to anon
using (active = true);
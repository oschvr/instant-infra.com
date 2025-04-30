create table challenges (
    id uuid default uuid_generate_v4() primary key,
    provider_id uuid references providers(id) on delete cascade,
    deployment_id uuid references deployments(id) on delete cascade,
    is_done boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for foreign keys for better performance
create index idx_challenges_provider_id on challenges(provider_id);
create index idx_challenges_deployment_id on challenges(deployment_id);

-- Enable row level security
alter table challenges enable row level security;

-- Allow select on challenges to anyone
create policy "Anyone can read challenges types"
on challenges for select
to anon
using (true);

-- Allow authenticated users to update challenges
create policy "Authenticated users can update challenges"
on challenges for update
to authenticated
using (true)
with check (true);
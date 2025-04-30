create table deployments (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add initial data
insert into deployments (name) values 
  ('Kubernetes Cluster'),
  ('Basic VM'),
  ('Static Website'),
  ('Database'),
  ('Storage bucket'),
  ('Message Queue'),
  ('Container Registry'),
  ('K8S: ArgoCD'),
  ('K8S: Ingress Nginx'),
  ('K8S: ECK Stack'),
  ('K8S: Kube Prometheus Stack');
  

-- Allow anyone to read deployment types
create policy "Anyone can read deployment types"
on deployments for select
to anon
using (active = true);
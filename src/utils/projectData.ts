
export interface CloudProject {
  id: string;
  name: string;
  category?: string;
}

// Projects grouped by category
export const CLOUD_PROJECTS: CloudProject[] = [
  { id: 'kubernetes', name: 'Kubernetes Cluster', category: 'infrastructure' },
  { id: 'vm', name: 'Basic VM', category: 'compute' },
  { id: 'static-website', name: 'Static Website', category: 'web' },
  { id: 'database', name: 'Database', category: 'data' },
  { id: 'storage', name: 'Storage bucket', category: 'storage' },
  { id: 'queue', name: 'Message Queue', category: 'messaging' },
  { id: 'registry', name: 'Container Registry', category: 'containers' },
  { id: 'argocd', name: 'K8S: ArgoCD', category: 'kubernetes' },
  { id: 'ingress', name: 'K8S: Ingress Nginx', category: 'kubernetes' },
  { id: 'eck', name: 'K8S: ECK Stack', category: 'kubernetes' },
  { id: 'prometheus', name: 'K8S: Kube Prometheus Stack', category: 'kubernetes' },
];

export function getRandomProject(): CloudProject {
  const randomIndex = Math.floor(Math.random() * CLOUD_PROJECTS.length);
  return CLOUD_PROJECTS[randomIndex];
}

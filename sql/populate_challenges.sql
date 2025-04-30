INSERT INTO challenges (provider_id, deployment_id, is_done)
SELECT 
  p.id AS provider_id,
  d.id AS deployment_id,
  false AS is_done
FROM 
  providers p
CROSS JOIN 
  deployments d
WHERE 
  p.active = true AND d.active = true
  AND NOT EXISTS (
    SELECT 1
    FROM challenges c
    WHERE c.provider_id = p.id AND c.deployment_id = d.id
  );



SELECT 
  c.id, 
  p.name AS provider_name, 
  d.name AS deployment_name, 
  c.is_done,
  c.created_at
FROM 
  challenges c
JOIN 
  providers p ON c.provider_id = p.id
JOIN 
  deployments d ON c.deployment_id = d.id
ORDER BY 
  p.name, d.name;
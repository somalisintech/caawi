SELECT
  p.id,
  p."userType",
  u."firstName",
  u."lastName",
  p.bio,
  u.image,
  cu.scheduling_url as "calendlySchedulingUrl",
  p.gender,
  p."sameGenderPref",
  p."yearsOfExperience",
  p."linkedInUrl",
  p."githubUrl",
  p."buyMeCoffeeUrl",
  l.city,
  l.country,
  o.role,
  o.company,
  array_agg(s.name) as skills
FROM "Profile" p
       JOIN "User" u ON u."id" = p."userId"
       LEFT JOIN "Location" l ON p."locationId" = l.id
       LEFT JOIN "Occupation" o ON p."occupationId" = o.id
       LEFT JOIN "CalendlyUser" cu ON p."calendlyUserUri" = cu.uri
       LEFT JOIN "_ProfileSkills" ps ON p.id = ps."A"
       LEFT JOIN "Skill" s ON ps."B" = s.id
WHERE p."userType" = 'MENTOR'
GROUP BY p.id, u."firstName", u."lastName", p.bio, u.image, cu.scheduling_url, p.gender, p."sameGenderPref", p."yearsOfExperience", p."linkedInUrl", p."githubUrl", p."buyMeCoffeeUrl", l.city, l.country, o.role, o.company;

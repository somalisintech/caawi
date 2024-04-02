CREATE VIEW "MentorProfile" AS
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
  l.city,
  l.country,
  o.role ,
  o."yearsOfExperience",
  o.company
FROM "Profile" p
       JOIN "User" u ON u."profileId" = p.id
       LEFT JOIN "Location" l ON p."locationId" = l.id
       LEFT JOIN "Occupation" o ON p."occupationId" = o.id
       LEFT JOIN "CalendlyUser" cu ON p."calendlyUserUri" = cu.uri
WHERE p."userType" = 'MENTOR';

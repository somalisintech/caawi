SELECT
  p.id,
  p."userType",
  u."firstName",
  u."lastName",
  p.bio,
  u.image,
  p.gender,
  p."sameGenderPref",
  l.city,
  l.country,
  o.role,
  o."yearsOfExperience",
  c.name AS company
FROM
  (
    (
      (
        (
          "Profile" p
          JOIN "User" u ON ((u."profileId" = p.id))
        )
        LEFT JOIN "Location" l ON ((p."locationId" = l.id))
      )
      LEFT JOIN "Occupation" o ON ((p."occupationId" = o.id))
    )
    LEFT JOIN "Company" c ON ((o."companyId" = c.id))
  )
WHERE
  (p."userType" = 'MENTOR' :: "UserType");

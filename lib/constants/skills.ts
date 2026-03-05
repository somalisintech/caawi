export const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  'Software Engineering': [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'React',
    'Node.js',
    'System Design',
    'DevOps',
    'AWS',
    'Docker',
    'Kubernetes',
    'SQL',
    'GraphQL',
    'REST APIs',
    'Mobile Development',
    'iOS',
    'Android'
  ],
  'Product Management': [
    'Product Strategy',
    'User Research',
    'Roadmapping',
    'Agile/Scrum',
    'A/B Testing',
    'PRDs',
    'Stakeholder Management'
  ],
  Design: ['UI Design', 'UX Design', 'Figma', 'Design Systems', 'User Testing', 'Prototyping', 'Accessibility'],
  'Data Science': [
    'Machine Learning',
    'Data Analysis',
    'Python (Data)',
    'R',
    'SQL (Analytics)',
    'Data Visualization',
    'Statistics',
    'NLP',
    'Deep Learning'
  ],
  Marketing: [
    'Content Marketing',
    'SEO',
    'Social Media',
    'Growth Marketing',
    'Email Marketing',
    'Brand Strategy',
    'Analytics'
  ],
  Finance: ['Financial Modeling', 'Accounting', 'Investment Analysis', 'Fundraising', 'Budgeting', 'FinTech'],
  'Business Development': [
    'Sales Strategy',
    'Partnerships',
    'Negotiation',
    'Business Strategy',
    'Market Research',
    'Pitch Decks'
  ],
  Operations: ['Project Management', 'Process Improvement', 'Supply Chain', 'People Operations', 'Vendor Management'],
  'Career Development': [
    'Resume Writing',
    'Interview Prep',
    'Networking',
    'Public Speaking',
    'Leadership',
    'Personal Branding'
  ]
};

/** Reverse lookup: skill name → category */
export const SKILL_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(SKILLS_BY_CATEGORY).flatMap(([category, skills]) => skills.map((name) => [name, category]))
);

import type { ExperienceItem } from '@/types'

export const experience: ExperienceItem[] = [
  {
    company: 'Takeo.ai',
    role: 'Senior Fullstack Developer',
    start: '2023',
    current: true,
    description:
      'Writing modern, performant, maintainable code for a diverse array of client and internal projects.',
    achievements: [
      'Integrate internally developed systems and marketplace third-party modules into existing systems',
      'Estimate, perform feasibility analysis, forecast risks, and plan delivery for new requirements',
      'Contribute across every project delivery phase — analysis, development, testing, and operations',
      'Communicate daily with multi-disciplinary teams of engineers, designers, producers, and clients',
    ],
    technologies: ['TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    company: 'EB Pearls',
    role: 'Fullstack JS Developer',
    start: '2021',
    end: '2021',
    description:
      'Built Node.js, MongoDB, and Express applications designed to grow with the business.',
    achievements: [
      'Integrated multiple data sources and databases into one system',
      'Implemented user authentication and authorization across multiple systems, servers, and environments',
      'Coded, tested, and operated Node.js services, identifying and fixing defects before they became problems',
      'Created database schemas supporting business processes and customer-facing payment administration',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
  },
  {
    company: 'Rosebay Consult',
    role: 'Blockchain Developer',
    start: '2017',
    end: '2018',
    description:
      'Researched blockchain, Ethereum, and similar cryptocurrency technologies to develop distributed applications.',
    achievements: [
      'Built distributed apps with Linux, JavaScript (Web3.js), HTML5, and Solidity',
      'Tested developed apps with test cases and checked them for vulnerabilities',
    ],
    technologies: ['Solidity', 'Web3.js', 'Ethereum', 'JavaScript'],
  },
  {
    company: 'Cheetah Webtech',
    role: 'PHP Developer',
    start: '2017',
    end: '2017',
    description:
      'Developed and maintained code for in-house and client websites, primarily using PHP and WordPress.',
    achievements: [
      'Shipped CMS and inventory-management projects for various businesses',
      'Tested sites for responsiveness and contributed to making them SEO friendly alongside SEO experts',
    ],
    technologies: ['PHP', 'WordPress', 'MySQL'],
  },
  {
    company: 'Hitech Nepal',
    role: 'Intern',
    start: '2016',
    end: '2016',
    description:
      'Developed a restaurant-management mobile app system using PHP, MySQL, and Android, along with its web app.',
    achievements: [
      'Built the web application for the same restaurant-management project',
      'Learned to work on a project in a more formal manner, including project-management skills',
    ],
    technologies: ['PHP', 'MySQL', 'Android', 'Java'],
  },
]

/**
 * CompliScan AI — Development Team Configuration
 * Single source of truth for the Smart India Hackathon 2026 development team.
 * Easily editable by replacing values without modifying UI components.
 */

export interface TeamMember {
  id: number;
  name: string;
  photo: string | null;
  education: string;
  session: string;
  admission: string;
  rollNo: string;
  role: string;
  isLead?: boolean;
  isPlaceholder?: boolean;
  contributions: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Shubham Kumar',
    photo: '/assets/shubham-kumar.png',
    education: 'B.Tech — Information Technology',
    session: '2024–27',
    admission: 'D2D',
    rollNo: '2311167',
    role: 'Full-Stack & AI Developer',
    isLead: true,
    isPlaceholder: false,
    contributions: [
      'Designed and developed the CompliScan AI frontend with responsive, accessible UI/UX',
      'Integrated OCR.Space API for high-precision product label text & symbol extraction',
      'Integrated Groq AI (Llama/OpenAI models) for structured commodity attribute extraction',
      'Engineered authentication, JWT session management, and MongoDB Atlas persistence',
      'Developed deterministic Indian Compliance Rule Engine (Legal Metrology, FSSAI, CDSCO)',
      'Built automated scan history, streaming PDF compliance report generation & deployment'
    ],
  },
  {
    id: 2,
    name: 'Team Member 2',
    photo: null,
    education: 'Details to be updated',
    session: '2024–27',
    admission: 'Details to be updated',
    rollNo: '—',
    role: 'Details to be updated',
    isLead: false,
    isPlaceholder: true,
    contributions: [
      'Photo to be added',
      'Role & contributions to be updated'
    ],
  },
  {
    id: 3,
    name: 'Team Member 3',
    photo: null,
    education: 'Details to be updated',
    session: '2024–27',
    admission: 'Details to be updated',
    rollNo: '—',
    role: 'Details to be updated',
    isLead: false,
    isPlaceholder: true,
    contributions: [
      'Photo to be added',
      'Role & contributions to be updated'
    ],
  },
  {
    id: 4,
    name: 'Team Member 4',
    photo: null,
    education: 'Details to be updated',
    session: '2024–27',
    admission: 'Details to be updated',
    rollNo: '—',
    role: 'Details to be updated',
    isLead: false,
    isPlaceholder: true,
    contributions: [
      'Photo to be added',
      'Role & contributions to be updated'
    ],
  },
  {
    id: 5,
    name: 'Team Member 5',
    photo: null,
    education: 'Details to be updated',
    session: '2024–27',
    admission: 'Details to be updated',
    rollNo: '—',
    role: 'Details to be updated',
    isLead: false,
    isPlaceholder: true,
    contributions: [
      'Photo to be added',
      'Role & contributions to be updated'
    ],
  },
  {
    id: 6,
    name: 'Team Member 6',
    photo: null,
    education: 'Details to be updated',
    session: '2024–27',
    admission: 'Details to be updated',
    rollNo: '—',
    role: 'Details to be updated',
    isLead: false,
    isPlaceholder: true,
    contributions: [
      'Photo to be added',
      'Role & contributions to be updated'
    ],
  }
];

export const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Product Image',
    desc: 'Captured or uploaded package label',
    icon: 'Camera',
  },
  {
    step: 2,
    title: 'OCR.Space',
    desc: 'Automated high-speed OCR extraction',
    icon: 'Scan',
  },
  {
    step: 3,
    title: 'Groq AI',
    desc: 'High-throughput LLM understanding',
    icon: 'Cpu',
  },
  {
    step: 4,
    title: 'Structured Product Data',
    desc: 'MRP, Dates, Net Qty, Origin, FSSAI',
    icon: 'FileJson',
  },
  {
    step: 5,
    title: 'Compliance Rule Engine',
    desc: 'Statutory verification (PCR 2011)',
    icon: 'ShieldCheck',
  },
  {
    step: 6,
    title: 'Compliance Analysis',
    desc: 'Deterministic scores & issue detection',
    icon: 'CheckCircle2',
  },
  {
    step: 7,
    title: 'Premium Report',
    desc: 'Downloadable PDF inspection report',
    icon: 'FileText',
  }
];

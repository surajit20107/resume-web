// ---------------------------------------------------------------------------
// Single source of truth for the resume.
//
// You can change your resume in two ways:
//   1. In code — edit the values below (these are the defaults).
//   2. In the browser — click "Edit" and change anything, then click "Download".
//      Browser edits are saved to localStorage automatically.
//
// The renderer and the ATS plain-text export both use this exact shape, so
// keep the structure intact when you add or remove content.
// ---------------------------------------------------------------------------

export const defaultResume = {
  name: 'Surajit Jana',
  headline: 'Aspiring Software Developer | AI & Agents Enthusiast',
  location: 'Kolkata, India',
  phone: '+91-9330975907',
  email: 'surajitdev20107@gmail.com',
  links: [
    {
      label: 'GitHub',
      value: 'surajit20107',
      url: 'https://github.com/surajit20107',
    },
    {
      label: 'Portfolio',
      value: 'surajit-dev.vercel.app',
      url: 'https://surajit-dev.vercel.app',
    },
    {
      label: 'Leetcode',
      value: 'surajit_07',
      url: 'https://leetcode.com/u/surajit_07',
    },
    {
      label: 'Linkedin',
      value: 'surajit-jana20107',
      url: 'https://www.linkedin.com/in/surajit-jana20107',
    },
  ],
  summary: 'Shipped 5+ production web apps and AI-integrated SaaS tools reaching 200+ cumulative real users, with 2+ years of hands-on JavaScript/TypeScript development across freelance projects — from UI/UX design through backend engineering to cloud deployment.',

  // Order of the body sections in the rendered resume and the plain-text
  // export. Reorder this list to change which section appears first.
  sectionOrder: ['summary', 'skills', 'education', 'experience', 'projects'],

  skills: [
    {
      label: 'Languages',
      value: 'JavaScript (ES6+), TypeScript, SQL, Python, GoLang, C, C++, Java',
    },
    {
      label: 'Frontend',
      value:
        'HTML5, CSS3, React.js, Next.js, React Native, Redux / Redux Toolkit, React Query, Tailwind CSS, Framer Motion, MUI, Bootstrap',
    },
    {
      label: 'Backend',
      value:
        'Node.js, Express.js, Fastify, Hono, Spring Boot, Gin-gonic, FastAPI, REST APIs, GraphQL, Socket.IO, JWT Auth, OAuth, MVC Architecture, Microservices',
    },
    {
      label: 'Databases',
      value: 'MongoDB, PostgreSQL, Redis, Prisma ORM, Pinecone vector DB, Supabase, SQLite',
    },
    {
      label: 'AI & Agents',
      value:
        'LangChain, LangGraph, Google Gemini AI, Vercel AI SDK, Inngest Agent Kit, Tavily, Zod',
    },
    {
      label: 'Tools & Deployment',
      value:
        'Git, GitHub, GitHub Actions (CI/CD), Docker, Nginx, Linux, Vercel, Render, Netlify, Cloudinary, Postman, Figma, VS Code',
    },
  ],

  experience: [
    {
      title: 'Full Stack Developer',
      company: 'Freelance (Self-Employed, Remote)',
      dates: 'Jun 2024 – Present',
      bullets: [
        'Designed, built, and deployed 5+ production web apps end-to-end — from requirements and UI/UX through backend engineering and testing — on Vercel and Render.',
        'Set up GitHub Actions CI/CD pipelines and Redis caching per app, while owning architecture decisions, client communication, and post-launch support solo across all projects.',
      ],
    },
  ],

  projects: [
    {
      name: 'Code Hawk',
      tech:
        'Next.js, TypeScript, AI SDK, Better Auth, PostgreSQL, Prisma, Pinecone, Inngest, Octokit, Tailwind CSS',
      links: [
        {
          label: 'GitHub',
          value: 'github.com/surajit20107/code-hawk',
          url: 'https://github.com/surajit20107/code-hawk',
        },
        {
          label: 'Live',
          value: 'code-hawk.vercel.app',
          url: 'https://code-hawk.vercel.app',
        },
      ],
      bullets: [
        'Built an AI-powered PR review platform using a RAG pipeline to analyze only modified code instead of the full codebase, cutting unnecessary context processing by 80%.',
        'Added automated review workflows, PR insights, and coding-activity tracking on top of the RAG pipeline.',
      ],
    },
    {
      name: 'PPTGenie',
      tech:
        'React, TanStack Start, TypeScript, AI SDK, Better Auth, Prisma, PostgreSQL, Inngest, Tailwind CSS',
      links: [
        {
          label: 'GitHub',
          value: 'github.com/surajit20107/PPTGenie',
          url: 'https://github.com/surajit20107/PPTGenie',
        },
        {
          label: 'Live',
          value: 'ppt-genie.vercel.app',
          url: 'https://ppt-genie.vercel.app',
        },
      ],
      bullets: [
        'Built an AI presentation generator that turns text prompts into ready-to-use, customizable slide decks through an AI-SDK generation pipeline.',
      ],
    },
    {
      name: 'AI Ticket Agent',
      tech:
        'MongoDB, Express, React, Node.js, Inngest Agent Kit, Google Generative AI, JWT, Tailwind CSS',
      links: [
        {
          label: 'GitHub',
          value: 'github.com/surajit20107/Ai-Ticket-Agent',
          url: 'https://github.com/surajit20107/Ai-Ticket-Agent',
        },
        {
          label: 'Live',
          value: 'ticket-pilot.vercel.app',
          url: 'https://ticket-pilot.vercel.app',
        },
      ],
      bullets: [
        'Automated 70%+ of support-ticket classification by integrating Google Generative AI into the triage pipeline, removing manual review for 20+ beta users.',
        'Implemented JWT authentication with scoped access control across the MERN stack, running with zero auth-related production incidents.',
      ],
    },
    {
      name: 'Autonomous Agent',
      tech: 'Next.js, React, TypeScript, LangChain, LangGraph, Google Gemini AI, Tavily',
      links: [
        {
          label: 'GitHub',
          value: 'github.com/surajit20107/Autonomous-Agent',
          url: 'https://github.com/surajit20107/Autonomous-Agent',
        },
        {
          label: 'Live',
          value: 'zevinagent.vercel.app',
          url: 'https://zevinagent.vercel.app',
        },
      ],
      bullets: [
        'Orchestrated Google Gemini AI and Tavily search through a LangGraph multi-step retrieval pipeline, cutting manual research time by ~60% per session for 30+ users.',
      ],
    },
  ],

  education: [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      school: 'IGNOU, Kolkata',
      dates: 'Currently Pursuing',
    },
    {
      degree: 'Higher Secondary (Class XII)',
      school: 'West Bengal Board',
      dates: 'Passed 2021',
    },
    {
      degree: 'Secondary (Class X)',
      school: 'West Bengal Board',
      dates: 'Passed 2019',
    },
  ],
}

export const DEFAULT_SECTION_ORDER = defaultResume.sectionOrder

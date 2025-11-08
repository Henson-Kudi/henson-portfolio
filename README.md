# Henson Kudi Amah Portfolio

A modern, responsive portfolio website for Henson Kudi Amah - Senior Software Engineer with 5+ years of coding experience and leading backend teams on Node Js, Typescript, C#, and AWS.

## Features

- **Modern Design**: Clean, professional interface with dark mode support
- **Responsive Layout**: Fully responsive design that works seamlessly across all devices
- **Dynamic Resume**: Interactive resume page with downloadable PDF functionality
- **Project Showcase**: Featured projects section highlighting key work and achievements
- **Contact Form**: Easy-to-use contact form for professional inquiries
- **SEO Optimized**: Comprehensive meta tags and OpenGraph integration for better discoverability

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: React-pdf for resume downloads
- **Deployment**: [Vercel](https://vercel.com/)

## Project Structure

\`\`\`
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage with hero and featured projects
│   ├── resume/              # Resume page with PDF download
│   ├── projects/            # Projects showcase
│   ├── contact/             # Contact form
│   └── api/                 # API routes (PDF generation)
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── server-hero-section.tsx
│   ├── featured-projects.tsx
│   └── ...
├── data/                    # Data files
│   └── resume-data.ts       # Resume content and structure
├── lib/                     # Utility functions
└── public/                  # Static assets
\`\`\`

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Henson-Kudi/henson-portfolio.git
cd henson-portfolio
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Personal Information

Update your personal information in `data/resume-data.ts`:

\`\`\`typescript
const resumeData: ResumeData = {
  personalInfo: {
    name: "Your Name",
    title: "Your Title",
    email: "your@email.com",
    // ... other fields
  },
  // ... rest of your data
}
\`\`\`

### Styling and Theme

Customize colors and design tokens in `app/globals.css`:

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 9% 9%;
  /* ... other design tokens */
}
\`\`\`

## Deployment

This project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.


## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License.

## Contact

Henson Kudi Amah
- Website: [amahkudi.dev](https://amahkudi.dev)
- LinkedIn: [linkedin.com/in/henson-kudi-amah-64736b190](https://www.linkedin.com/in/henson-kudi-amah-64736b190)
- GitHub: [github.com/Henson-Kudi](https://github.com/Henson-Kudi/)
- Email: amahkudi@gmail.com

import { BlogPostPageClient } from "./BlogPostPageClient"
import type { Metadata } from "next"

// This would typically come from a CMS or markdown files
const getPostBySlug = (slug: string) => {
  return {
    title: "Building a Modern Web Application with Next.js and Tailwind CSS",
    date: "March 15, 2023",
    readTime: "10 min read",
    image: "/placeholder.svg?height=500&width=1200&text=Next.js+and+Tailwind",
    content: `
      <p>Next.js has emerged as one of the most popular React frameworks for building modern web applications. Combined with Tailwind CSS, it provides a powerful toolkit for creating responsive, performant, and visually appealing websites.</p>
      
      <h2>Why Next.js?</h2>
      
      <p>Next.js offers several advantages over traditional React applications:</p>
      
      <ul>
        <li>Server-side rendering (SSR) for improved SEO and initial load performance</li>
        <li>Static site generation (SSG) for blazing-fast page loads</li>
        <li>Automatic code splitting for smaller bundle sizes</li>
        <li>Built-in API routes for backend functionality</li>
        <li>File-based routing for simplified navigation</li>
      </ul>
      
      <h2>Getting Started with Next.js</h2>
      
      <p>To create a new Next.js application, you can use the following command:</p>
      
      <pre><code>npx create-next-app my-app</code></pre>
      
      <p>This will set up a new Next.js project with all the necessary configurations. You can then start the development server with:</p>
      
      <pre><code>cd my-app
npm run dev</code></pre>
      
      <h2>Adding Tailwind CSS</h2>
      
      <p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. To add Tailwind CSS to your Next.js project, you can follow these steps:</p>
      
      <pre><code>npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>
      
      <p>Then, configure your tailwind.config.js file:</p>
      
      <pre><code>module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}</code></pre>
      
      <p>Finally, add the Tailwind directives to your CSS:</p>
      
      <pre><code>@tailwind base;
@tailwind components;
@tailwind utilities;</code></pre>
      
      <h2>Building Components</h2>
      
      <p>With Next.js and Tailwind CSS set up, you can start building components for your application. Here's an example of a simple card component:</p>
      
      <pre><code>export default function Card({ title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}</code></pre>
      
      <h2>Deploying Your Application</h2>
      
      <p>Once you've built your application, you can deploy it to various platforms. Vercel, the company behind Next.js, offers a seamless deployment experience:</p>
      
      <pre><code>npm install -g vercel
vercel</code></pre>
      
      <p>This will deploy your application to Vercel's platform, providing you with a URL to access your site.</p>
      
      <h2>Conclusion</h2>
      
      <p>Next.js and Tailwind CSS provide a powerful combination for building modern web applications. With server-side rendering, static site generation, and utility-first styling, you can create fast, responsive, and visually appealing websites with ease.</p>
      
      <p>In future articles, we'll explore more advanced topics such as authentication, API routes, and optimizing performance in Next.js applications.</p>
    `,
    tags: ["Next.js", "Tailwind CSS", "React", "Web Development"],
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  return {
    title: post.title,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, "") + "...",
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, "") + "...",
      type: "article",
      publishedTime: post.date,
      authors: ["Giovani Moutinho"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, "") + "...",
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostPageClient params={params} />
}

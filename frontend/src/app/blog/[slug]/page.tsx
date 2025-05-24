import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPost from "../../../components/blog/blog-post"
import BlogComments from "../../../components/blog/blog-comments"
import BlogSidebar from "../../../components/blog/blog-sidebar"

const getBlogPost = async (slug: string) => {
  const mockPost = {
    id: 1,
    title: "Building Modern Web Applications with Next.js and Django",
    slug: "building-modern-web-applications-nextjs-django",
    excerpt: "Learn how to create full-stack applications using Next.js for the frontend and Django for the backend.",
    content: `
      <h2>Introduction</h2>
      <p>In this comprehensive guide, we'll explore how to build modern web applications using Next.js for the frontend and Django for the backend. This powerful combination provides excellent developer experience and performance.</p>
      
      <h2>Setting Up the Development Environment</h2>
      <p>First, let's set up our development environment. We'll need Node.js for Next.js and Python for Django.</p>
      
      <h3>Frontend Setup</h3>
      <p>Create a new Next.js application:</p>
      <pre><code>npx create-next-app@latest my-app --typescript --tailwind --eslint</code></pre>
      
      <h3>Backend Setup</h3>
      <p>Set up a Django project with virtual environment:</p>
      <pre><code>python -m venv venv
source venv/bin/activate
pip install django djangorestframework</code></pre>
      
      <h2>Building the API</h2>
      <p>Django REST Framework makes it easy to build robust APIs. Here's how to create a simple blog API...</p>
      
      <h2>Connecting Frontend to Backend</h2>
      <p>Next.js provides excellent tools for data fetching. We'll use the built-in fetch API to connect to our Django backend...</p>
      
      <h2>Conclusion</h2>
      <p>This combination of Next.js and Django provides a powerful foundation for building modern web applications. The separation of concerns allows for better scalability and maintainability.</p>
    `,
    featuredImage: "/placeholder.svg?height=400&width=800",
    category: { name: "Web Development", slug: "web-development" },
    tags: [
      { name: "Next.js", slug: "nextjs" },
      { name: "Django", slug: "django" },
      { name: "Full Stack", slug: "full-stack" },
    ],
    readingTime: 8,
    views: 1250,
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  }

  if (slug !== mockPost.slug) {
    return null
  }

  return mockPost
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogPost post={post} />
            <BlogComments postId={post.id} />
          </div>
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

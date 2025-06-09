import type { Metadata } from "next"
import BlogList from "../../components/blog/blog-list"
import BlogHero from "../../components/blog/blog-hero"
import BlogCategories from "../../components/blog/blog-categories"

export const metadata: Metadata = {
  title: "Blog - Insights & Tutorials",
  description: "Read about web development, programming tips, and technology insights.",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <BlogHero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogList />
          </div>
          <div className="lg:col-span-1">
            <BlogCategories />
          </div>
        </div>
      </div>
    </div>
  )
}
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  author: string
  tags: string[]
  publishedAt: { seconds: number } | null
  seoTitle?: string
  seoDescription?: string
}

async function getPost(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, 'blog_posts'),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Post
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug).catch(() => null)
  if (!post) return { title: 'Post Not Found | Gayduo Sports Academy' }

  const title = post.seoTitle || `${post.title} | Gayduo Sports Academy`
  const description = post.seoDescription || post.excerpt
  const image = post.featuredImage

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : undefined,
      authors: [post.author],
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

function formatDate(ts: Post['publishedAt']) {
  if (!ts) return ''
  return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug).catch(() => null)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-[#01255f] py-12 sm:py-16 px-5 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            {post.tags?.[0] && (
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#01255f] bg-[#fee11b] px-2 py-0.5 inline-block mb-4">
                {post.tags[0]}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/50 text-xs">
              <span>{post.author}</span>
              <span>·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>

        {post.featuredImage && (
          <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-gray-100">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
          <div className="prose prose-sm sm:prose max-w-none text-[#0d0d0d] prose-headings:text-[#01255f] prose-headings:font-bold prose-a:text-[#01255f] prose-strong:text-[#0d0d0d] prose-blockquote:border-l-[#fee11b] prose-blockquote:text-[#5a6478]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-[#5a6478] border border-gray-200 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link href="/blog" className="text-sm font-bold text-[#01255f] hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              image: post.featuredImage,
              author: { '@type': 'Organization', name: post.author },
              publisher: {
                '@type': 'Organization',
                name: 'Gayduo Sports Academy',
                logo: { '@type': 'ImageObject', url: '/Logo.png' },
              },
              datePublished: post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : null,
            }),
          }}
        />
      </main>
      <Footer />
    </>
  )
}

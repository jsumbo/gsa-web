import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog & News | Gayduo Sports Academy',
  description: 'Stories, updates, and insights from Gayduo Sports Academy — empowering youth in Monrovia, Liberia through sport, education, and health.',
  openGraph: {
    title: 'Blog & News | Gayduo Sports Academy',
    description: 'Stories, updates, and insights from Gayduo Sports Academy.',
    type: 'website',
  },
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  author: string
  tags: string[]
  publishedAt: { seconds: number } | null
}

async function getPosts(): Promise<Post[]> {
  const q = query(
    collection(db, 'blog_posts'),
    where('status', '==', 'published')
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Post))
    .sort((a, b) => (b.publishedAt?.seconds ?? 0) - (a.publishedAt?.seconds ?? 0))
}

function formatDate(ts: Post['publishedAt']) {
  if (!ts) return ''
  return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getPosts().catch(() => [] as Post[])

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <div className="bg-[#01255f] py-16 sm:py-20 px-5 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <span className="text-[#fee11b] text-[10px] font-bold uppercase tracking-[0.2em] block mb-4">
              News & Stories
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Latest from Gayduo
            </h1>
          </div>
        </div>

        <section className="py-16 sm:py-24 bg-[#f5f7fc]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-[#5a6478]">
                <p className="text-lg font-medium">No posts published yet.</p>
                <p className="text-sm mt-2">Check back soon for stories from our programmes.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={`group bg-white border border-gray-100 hover:border-[#01255f] transition-all duration-200 hover:shadow-sm ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  >
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#01255f] flex items-center justify-center">
                          <div className="relative h-10 w-32 opacity-30">
                            <Image src="/Logo.png" alt="" fill className="object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6">
                      {post.tags?.[0] && (
                        <span className="text-[9px] uppercase tracking-widest font-bold text-[#fee11b] bg-[#01255f] px-2 py-0.5 inline-block mb-3">
                          {post.tags[0]}
                        </span>
                      )}
                      <h2 className="font-bold text-[#01255f] text-base mb-2 leading-snug group-hover:underline" style={{ fontFamily: 'var(--font-heading)' }}>
                        {post.title}
                      </h2>
                      <p className="text-[#5a6478] text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{formatDate(post.publishedAt)}</span>
                        <span className="text-[10px] font-bold text-[#01255f] uppercase tracking-widest">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

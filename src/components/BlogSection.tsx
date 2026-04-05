import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  tags: string[]
  publishedAt: { seconds: number } | null
}

async function getLatestPosts(): Promise<Post[]> {
  const q = query(
    collection(db, 'blog_posts'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(3)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post))
}

function formatDate(ts: Post['publishedAt']) {
  if (!ts) return ''
  return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function BlogSection() {
  const posts = await getLatestPosts().catch(() => [] as Post[])
  if (posts.length === 0) return null

  return (
    <section id="blog" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="label">Latest News</span>
            <h2
              className="heading-underline text-2xl sm:text-3xl lg:text-[2.4rem] font-bold text-[#01255f] leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Stories from the Field
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-[#01255f] uppercase tracking-widest hover:underline flex-shrink-0"
          >
            All Posts →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white hover:bg-[#f5f7fc] transition-colors duration-200"
            >
              <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#01255f]/10 flex items-center justify-center">
                    <span className="text-[#01255f]/30 text-xs font-bold uppercase tracking-widest">Gayduo Sports Academy</span>
                  </div>
                )}
              </div>
              <div className="p-5 sm:p-6">
                {post.tags?.[0] && (
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#fee11b] bg-[#01255f] px-2 py-0.5 inline-block mb-3">
                    {post.tags[0]}
                  </span>
                )}
                <h3
                  className="font-bold text-[#01255f] text-sm sm:text-base leading-snug mb-2 group-hover:underline"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {post.title}
                </h3>
                <p className="text-[#5a6478] text-xs sm:text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                <p className="text-[10px] text-gray-400 mt-3">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

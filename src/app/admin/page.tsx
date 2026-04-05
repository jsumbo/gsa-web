import { db } from '@/lib/firebase'
import { collection, getCountFromServer, query, where } from 'firebase/firestore'
import Link from 'next/link'

async function getStats() {
  const [contactsSnap, postsSnap, unreadSnap, publishedSnap] = await Promise.all([
    getCountFromServer(collection(db, 'contacts')),
    getCountFromServer(collection(db, 'blog_posts')),
    getCountFromServer(query(collection(db, 'contacts'), where('read', '==', false))),
    getCountFromServer(query(collection(db, 'blog_posts'), where('status', '==', 'published'))),
  ])
  return {
    contacts: contactsSnap.data().count,
    posts: postsSnap.data().count,
    unread: unreadSnap.data().count,
    published: publishedSnap.data().count,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats().catch(() => ({ contacts: 0, posts: 0, unread: 0, published: 0 }))

  const cards = [
    { label: 'Total Enquiries', value: stats.contacts, sub: `${stats.unread} unread`, href: '/admin/contacts', color: 'bg-[#01255f]' },
    { label: 'Blog Posts', value: stats.posts, sub: `${stats.published} published`, href: '/admin/blog', color: 'bg-[#011840]' },
  ]

  const quickLinks = [
    { href: '/admin/blog/new', label: 'Write New Post' },
    { href: '/admin/contacts', label: 'View Enquiries' },
    { href: '/', label: 'View Public Site' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#01255f]" style={{ fontFamily: 'var(--font-heading)' }}>
          Dashboard
        </h1>
        <p className="text-[#5a6478] text-sm mt-1">Welcome back, Admin.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`${c.color} text-white p-6 hover:opacity-90 transition-opacity`}>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2">{c.label}</p>
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{c.value}</p>
            <p className="text-[#fee11b] text-xs font-medium">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-6">
        <h2 className="font-bold text-[#01255f] text-sm uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-[#f5f7fc] hover:bg-[#01255f] hover:text-white border border-gray-200 hover:border-[#01255f] text-[#01255f] px-4 py-2.5 text-sm font-semibold transition-all"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

const SITE_URL = 'https://gayduosa.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  try {
    const q = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    )
    const snap = await getDocs(q)
    const blogPages: MetadataRoute.Sitemap = snap.docs.map((d) => ({
      url: `${SITE_URL}/blog/${d.data().slug}`,
      lastModified: d.data().updatedAt?.toDate?.() ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
    return [...staticPages, ...blogPages]
  } catch {
    return staticPages
  }
}

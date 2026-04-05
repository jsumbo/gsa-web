import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import BlogEditor from '@/components/BlogEditor'
import { notFound } from 'next/navigation'

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const snap = await getDoc(doc(db, 'blog_posts', id))
  if (!snap.exists()) notFound()

  const data = snap.data()

  return (
    <BlogEditor
      postId={id}
      initialData={{
        title: data.title ?? '',
        excerpt: data.excerpt ?? '',
        content: data.content ?? '',
        author: data.author ?? '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags ?? ''),
        status: data.status ?? 'draft',
        featuredImage: data.featuredImage ?? '',
        seoTitle: data.seoTitle ?? '',
        seoDescription: data.seoDescription ?? '',
      }}
    />
  )
}

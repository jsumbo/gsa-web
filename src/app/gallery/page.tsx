import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryClient from './client'

type Photo = { id: string; imageUrl: string; caption?: string }

async function getPhotos(): Promise<Photo[]> {
  try {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        imageUrl: data.imageUrl ?? '',
        caption: data.caption ?? '',
      }
    })
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Gallery | Gayduo Sports Academy',
  description: 'Photos and moments from Gayduo Sports Academy.',
}

export default async function GalleryPage() {
  const photos = await getPhotos()

  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-[70px]">
        {/* Hero */}
        <div className="bg-[#01255f] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <span className="label-light">Media</span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Gallery
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg">
              Moments from the pitch, the classroom, and the community.
            </p>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="bg-[#f5f7fc] py-14 sm:py-20">
          <GalleryClient photos={photos} />
        </div>
      </main>
      <Footer />
    </>
  )
}

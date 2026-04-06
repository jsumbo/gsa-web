'use client'

import { useState } from 'react'
import Image from 'next/image'
import GalleryModal from '@/components/GalleryModal'

type Photo = { id: string; imageUrl: string; caption?: string }

export default function GalleryClient({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handlePrev = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % photos.length)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        {photos.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[#5a6478] text-sm">No photos yet. Check back soon.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:gap-3 lg:gap-4">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => setSelectedIndex(idx)}
                className="break-inside-avoid mb-2 sm:mb-3 lg:mb-4 group relative overflow-hidden bg-[#e2e8f0] w-full text-left hover:opacity-80 transition-opacity"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || 'Gallery photo'}
                  width={600}
                  height={400}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-[#01255f]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs font-medium leading-relaxed">{photo.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <GalleryModal
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          imageUrl={photos[selectedIndex].imageUrl}
          caption={photos[selectedIndex].caption}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < photos.length - 1}
        />
      )}
    </>
  )
}

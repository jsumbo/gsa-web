'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Photo = { id: string; imageUrl: string; caption: string }

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [caption, setCaption] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    fetch('/api/admin/gallery')
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos ?? []))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const uploadAndSave = async (file: File) => {
    setUploading(true)
    setUploadError('')
    try {
      // 1. Upload to Supabase storage
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'website_files')
      form.append('folder', 'gallery')
      const upRes = await fetch('/api/upload', { method: 'POST', body: form })
      const upData = await upRes.json()
      if (!upRes.ok) throw new Error(upData.error ?? 'Upload failed')

      // 2. Save record in Firestore
      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: upData.url, caption }),
      })
      if (!saveRes.ok) throw new Error('Failed to save photo')

      setCaption('')
      load()
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) uploadAndSave(file)
    })
  }

  const del = async (id: string) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#01255f]" style={{ fontFamily: 'var(--font-heading)' }}>Gallery</h1>
        <p className="text-[#5a6478] text-sm mt-1">{photos.length} photos</p>
      </div>

      {/* Upload area */}
      <div className="mb-10 bg-white border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-[#01255f] uppercase tracking-widest mb-4">Upload Photos</h2>

        <div className="mb-4">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#5a6478] mb-1.5">
            Caption (optional — applies to next upload)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Training session, March 2025"
            className="w-full border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#01255f] transition-colors"
          />
        </div>

        <div
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed transition-colors cursor-pointer py-12 text-center ${
            uploading ? 'border-[#fee11b] bg-[#fee11b]/5' : 'border-gray-200 hover:border-[#01255f] hover:bg-[#f5f7fc]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#01255f] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#5a6478]">Uploading…</p>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-[#5a6478] font-medium">Click or drag photos to upload</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — multiple files supported</p>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="bg-white border border-gray-100 p-10 text-center text-sm text-[#5a6478]">Loading…</div>
      ) : photos.length === 0 ? (
        <div className="bg-white border border-gray-100 p-10 text-center text-sm text-[#5a6478]">
          No photos yet. Upload some above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-[#f5f7fc] overflow-hidden aspect-square">
              <Image
                src={photo.imageUrl}
                alt={photo.caption || 'Gallery photo'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#01255f]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3">
                {photo.caption && (
                  <p className="text-white text-xs text-center leading-relaxed line-clamp-2">{photo.caption}</p>
                )}
                <button
                  onClick={() => del(photo.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-1.5 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

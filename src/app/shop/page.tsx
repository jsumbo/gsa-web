import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopGrid, { Product } from '@/components/ShopGrid'

async function getProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    // Explicitly build plain objects — Firestore Timestamps cannot be passed to Client Components
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name ?? '',
        price: data.price ?? 0,
        image: data.image ?? '',
        description: data.description ?? '',
        category: data.category ?? '',
        available: data.available ?? true,
      }
    })
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Shop | Gayduo Sports Academy',
  description: 'Official Gayduo Sports Academy merchandise — kits, jerseys, and more.',
}

export default async function ShopPage() {
  const products = await getProducts()
  const available = products.filter((p) => p.available)

  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-[70px]">
        {/* Hero */}
        <div className="bg-[#01255f] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <span className="label-light">Official Store</span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              GSA Shop
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg">
              Support the academy — wear the badge. Official kits, jerseys, and merchandise.
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-[#f5f7fc] py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <ShopGrid products={products} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

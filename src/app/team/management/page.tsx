import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const PLACEHOLDER = 'https://fckzyvkbthqvmmjpvfxr.supabase.co/storage/v1/object/public/website_files/Gemini_Generated_Image_ihgfo6ihgfo6ihgf.png'

type Person = { id: string; name: string; role: string; image: string; section: 'board' | 'staff' }

async function getManagement(): Promise<Person[]> {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name ?? '',
        role: data.role ?? '',
        image: data.image ?? '',
        section: data.section === 'board' ? 'board' : 'staff',
      }
    })
  } catch { return [] }
}

export const metadata = {
  title: 'Management | Gayduo Sports Academy',
  description: 'Meet the board and management team at Gayduo Sports Academy.',
}

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="group bg-white border border-gray-100 hover:border-[#01255f]/20 hover:shadow-md transition-all duration-200">
      <div className="relative h-52 sm:h-60 overflow-hidden bg-[#f5f7fc]">
        <Image
          src={person.image || PLACEHOLDER}
          alt={person.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5">
        <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#fee11b] bg-[#01255f] inline-block px-2 py-0.5 mb-3">
          {person.role}
        </div>
        <h3 className="font-bold text-[#01255f] text-sm sm:text-base" style={{ fontFamily: 'var(--font-heading)' }}>
          {person.name}
        </h3>
      </div>
    </div>
  )
}

export default async function ManagementPage() {
  const management = await getManagement()
  const board = management.filter((p) => p.section === 'board')
  const staff = management.filter((p) => p.section === 'staff')

  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-[70px]">
        {/* Hero */}
        <div className="bg-[#01255f] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <span className="label-light">Leadership</span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Management
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg">
              The leadership driving Gayduo Sports Academy's vision and operations.
            </p>
          </div>
        </div>

        <div className="bg-[#f5f7fc] py-14 sm:py-20">
          <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <div className="mb-10">
              <span className="label">Governance</span>
              <h2
                className="heading-underline text-2xl sm:text-3xl font-bold text-[#01255f] mt-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Board of Directors
              </h2>
            </div>

            {board.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {board.map((person) => <PersonCard key={person.id} person={person} />)}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 px-6 py-8 text-sm text-[#5a6478]">
                No board members yet. Add them from Admin Management and select "Board".
              </div>
            )}
          </section>

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#01255f]/30 to-transparent" />
          </div>

          <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <div className="mb-10">
              <span className="label">Operations</span>
              <h2
                className="heading-underline text-2xl sm:text-3xl font-bold text-[#01255f] mt-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Management & Coaching Staff
              </h2>
            </div>

            {staff.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {staff.map((person) => <PersonCard key={person.id} person={person} />)}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 px-6 py-8 text-sm text-[#5a6478]">
                No staff members yet. Add them from Admin Management and select "Staff".
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

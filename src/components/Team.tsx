import Image from 'next/image'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

type Member = {
  id: string
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
}

async function getTeam(): Promise<Member[]> {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }))
  } catch {
    return []
  }
}

export default async function Team() {
  const team = await getTeam()

  return (
    <section id="team" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

        <div className="mb-10 sm:mb-14">
          <span className="label">Our Team</span>
          <h2
            className="heading-underline text-2xl sm:text-3xl lg:text-[2.4rem] font-bold text-[#01255f] leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The People Behind GSA
          </h2>
          <p className="mt-5 text-[#5a6478] text-sm sm:text-base max-w-xl">
            Practitioners, coaches, health workers, and community advocates committed to lasting change in Monrovia.
          </p>
        </div>

        {team.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {team.map((member) => (
              <div
                key={member.id}
                className="group bg-white hover:bg-[#f5f7fc] transition-colors duration-200"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#01255f]/10 flex items-center justify-center text-[#01255f] text-4xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="absolute bottom-3 right-3 w-8 h-8 bg-[#01255f] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#fee11b] bg-[#01255f] inline-block px-2 py-0.5 mb-3">
                    {member.role}
                  </div>
                  <h3
                    className="font-bold text-[#01255f] text-sm sm:text-base mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-[#5a6478] text-xs sm:text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

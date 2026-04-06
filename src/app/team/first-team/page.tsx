import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import PlayerGrid, { Player } from '@/components/PlayerGrid'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

async function getPlayers(): Promise<Player[]> {
  try {
    const q = query(collection(db, 'players'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Player, 'id'>) }))
    return all.filter((p) => p.team === 'first-team')
  } catch (e) {
    console.error('Failed to load first-team players:', e)
    return []
  }
}

export const metadata = {
  title: 'First Team | Gayduo Sports Academy',
  description: 'Meet the Gayduo Sports Academy First Team squad.',
}

export default async function FirstTeamPage() {
  const players = await getPlayers()

  const gk = players.filter((p) => p.position === 'goalkeeper').length
  const def = players.filter((p) => p.position === 'defender').length
  const mid = players.filter((p) => p.position === 'midfielder').length
  const fwd = players.filter((p) => p.position === 'forward').length

  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-[70px]">
        {/* Hero */}
        <div className="bg-[#01255f] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <span className="label-light">Our Club</span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              First Team
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg">
              The senior squad representing Gayduo Sports Academy in competitive football.
            </p>

            {players.length > 0 && (
              <div className="flex gap-6 mt-8 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { label: 'Squad', value: players.length },
                  { label: 'GK', value: gk },
                  { label: 'DEF', value: def },
                  { label: 'MID', value: mid },
                  { label: 'FWD', value: fwd },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center flex-shrink-0">
                    <p className="text-[#fee11b] font-black text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Squad */}
        <div className="bg-[#f5f7fc] py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            {players.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-[#5a6478] text-sm">Squad details coming soon.</p>
              </div>
            ) : (
              <PlayerGrid players={players} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

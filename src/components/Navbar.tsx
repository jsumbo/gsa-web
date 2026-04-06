'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const teamDropdown = [
  { label: 'First Team', href: '/team/first-team' },
  { label: 'Youth-15', href: '/team/youth-15' },
  { label: 'Management', href: '/team/management' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [teamOpen, setTeamOpen] = useState(false)
  const [mobileTeamOpen, setMobileTeamOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTeamOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const go = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('/')) return
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkClass = 'inline-flex items-center text-white/70 hover:text-white px-3 py-2 text-[13px] font-medium tracking-wide transition-colors leading-none'
  const mobileLinkClass = 'flex w-full items-center text-left text-white/70 hover:text-white px-2 py-3 text-sm font-medium tracking-wide border-b border-white/5 last:border-0'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#01255f] shadow-xl' : 'bg-[#01255f]'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">

          <Link href="/" className="flex items-center" aria-label="Gayduo Sports Academy home">
            <div className="relative h-9 w-36 sm:h-10 sm:w-44">
              <Image src="/Logo.png" alt="Gayduo Sports Academy" fill className="object-contain object-left" priority sizes="(max-width: 640px) 144px, 176px" />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <button onClick={() => go('#about')} className={linkClass}>About</button>
            <button onClick={() => go('#model')} className={linkClass}>Our Model</button>
            <button onClick={() => go('#impact')} className={linkClass}>Impact</button>
            <button onClick={() => go('#partners')} className={linkClass}>Partners</button>

            {/* Team dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setTeamOpen((o) => !o)}
                onMouseEnter={() => setTeamOpen(true)}
                className={`${linkClass} gap-1`}
              >
                Team
                <svg className={`w-3 h-3 transition-transform ${teamOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {teamOpen && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white shadow-xl border border-gray-100 min-w-[160px] py-1 z-50"
                  onMouseLeave={() => setTeamOpen(false)}
                >
                  {teamDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setTeamOpen(false)}
                      className="block px-5 py-2.5 text-[13px] font-medium text-[#01255f] hover:bg-[#fee11b] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" className={linkClass}>Blog</Link>
            <Link href="/gallery" className={linkClass}>Gallery</Link>
            <Link href="/shop" className={linkClass}>Shop</Link>
            <button onClick={() => go('#contact')} className={linkClass}>Contact</button>

            <button
              onClick={() => go('#contact')}
              className="ml-5 bg-[#fee11b] hover:bg-[#e5ca10] text-[#01255f] px-5 py-2 text-[13px] font-bold tracking-wide transition-colors"
            >
              Get Involved
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white p-2" aria-label="Toggle menu">
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-px bg-white transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-px bg-white transition-all ${menuOpen ? 'opacity-0 w-0' : ''}`} />
              <span className={`block h-px bg-white transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <button onClick={() => go('#about')} className={mobileLinkClass}>About</button>
            <button onClick={() => go('#model')} className={mobileLinkClass}>Our Model</button>
            <button onClick={() => go('#impact')} className={mobileLinkClass}>Impact</button>
            <button onClick={() => go('#partners')} className={mobileLinkClass}>Partners</button>

            {/* Team accordion */}
            <div>
              <button
                onClick={() => setMobileTeamOpen((o) => !o)}
                className="flex items-center justify-between w-full text-left text-white/70 hover:text-white px-2 py-3 text-sm font-medium tracking-wide border-b border-white/5"
              >
                Team
                <svg className={`w-3.5 h-3.5 transition-transform ${mobileTeamOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileTeamOpen && (
                <div className="bg-white/5 border-b border-white/5">
                  {teamDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-white/60 hover:text-white px-6 py-2.5 text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>Blog</Link>
            <Link href="/gallery" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>Gallery</Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>Shop</Link>
            <button onClick={() => go('#contact')} className={mobileLinkClass}>Contact</button>

            <button
              onClick={() => go('#contact')}
              className="mt-4 bg-[#fee11b] text-[#01255f] px-5 py-2.5 text-sm font-bold tracking-wide"
            >
              Get Involved
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

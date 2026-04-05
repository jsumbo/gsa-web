'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Our Model', href: '#model' },
  { label: 'Impact', href: '#impact' },
  { label: 'Partners', href: '#partners' },
  { label: 'Team', href: '#team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('/')) return // Let Link handle page nav
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#01255f] shadow-xl' : 'bg-[#01255f]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">

          <Link href="/" className="flex items-center" aria-label="Gayduo Sports Academy home">
            <div className="relative h-9 w-36 sm:h-10 sm:w-44">
              <Image
                src="/Logo.png"
                alt="Gayduo Sports Academy"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-white/70 hover:text-white px-3 py-2 text-[13px] font-medium tracking-wide transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="text-white/70 hover:text-white px-3 py-2 text-[13px] font-medium tracking-wide transition-colors"
                >
                  {l.label}
                </button>
              )
            )}
            <button
              onClick={() => go('#contact')}
              className="ml-5 bg-[#fee11b] hover:bg-[#e5ca10] text-[#01255f] px-5 py-2 text-[13px] font-bold tracking-wide transition-colors"
            >
              Get Involved
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-px bg-white transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-px bg-white transition-all ${menuOpen ? 'opacity-0 w-0' : ''}`} />
              <span className={`block h-px bg-white transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            {navLinks.map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-left text-white/70 hover:text-white px-2 py-3 text-sm font-medium tracking-wide border-b border-white/5 last:border-0"
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="block w-full text-left text-white/70 hover:text-white px-2 py-3 text-sm font-medium tracking-wide border-b border-white/5 last:border-0"
                >
                  {l.label}
                </button>
              )
            )}
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

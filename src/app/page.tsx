import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import ThreePillars from '@/components/ThreePillars'
import ImpactMetrics from '@/components/ImpactMetrics'
import Team from '@/components/Team'
import Partners from '@/components/Partners'
import Liberia from '@/components/Mozambique'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import BlogSection from '@/components/BlogSection'

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NGO',
            name: 'Gayduo Sports Academy',
            alternateName: 'Gayduo SA',
            url: 'https://gayduosa.org',
            logo: 'https://gayduosa.org/Logo.png',
            description:
              'Gayduo Sports Academy is a non-governmental organisation empowering youth in Monrovia, Liberia through sport, education, and healthcare.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Monrovia',
              addressCountry: 'LR',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'info@gayduosa.org',
              contactType: 'General Enquiry',
            },
            sameAs: [
              'https://instagram.com/gsa.liberia',
              'https://facebook.com',
              'https://linkedin.com',
              'https://tiktok.com',
            ],
          }),
        }}
      />

      <Navbar />
      <main>
        <Hero />
        <About />
        <ThreePillars />
        <ImpactMetrics />
        <Partners />
        <Liberia />
        <Team />
        <BlogSection />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

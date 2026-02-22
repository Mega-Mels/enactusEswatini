'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Enactus Eswatini</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting Swati youth to skills hoaning opportunities job opportunities and youth empowerment community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-500 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link href="/opportunities" className="text-gray-400 hover:text-white text-sm transition">Job Opportunities</Link></li>
              <li><Link href="/learning" className="text-gray-400 hover:text-white text-sm transition">E-Learning</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm transition">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-500 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li><Link href="/donate" className="text-gray-400 hover:text-white text-sm transition">Donate</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white text-sm transition">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-500 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Murray St, Mbabane</li>
              <li>Eswatini</li>
              <li className="pt-2 text-white">+268 7636 8299</li>
              <li className="pt-2 text-white">+268 7833 6348</li>
              <li className="text-yellow-500">tddlamini@enactus.org</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Enactus Eswatini Youth Hub
          </p>
        </div>
      </div>
    </footer>
  )
}
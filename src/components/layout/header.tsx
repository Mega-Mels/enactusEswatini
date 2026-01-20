'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User, LogOut, Menu, X, ChevronRight } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State to track mobile menu toggle
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/opportunities' },
    { name: 'Academy', href: '/learning' },
    { name: 'Donate', href: '/donate' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Enactus Remote Logo"
              width={80}
              height={40}
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-semibold text-slate-600 hover:text-yellow-500 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth & Mobile Toggle Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-10 animate-pulse bg-slate-100 rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200"
                >
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">View</p>
                    <p className="text-xs font-bold text-slate-700">Profile</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <User size={18} />
                  </div>
                </Link>
                <button onClick={handleSignOut} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition">
                Get Started
              </Link>
            )}
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-900 z-40 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between text-2xl font-black text-white hover:text-yellow-500 transition-colors tracking-tighter border-b border-slate-800 pb-4"
              >
                {link.name}
                <ChevronRight className="text-yellow-500" size={20} />
              </Link>
            ))}

            {/* Mobile Auth Actions */}
            <div className="pt-4">
              {user ? (
                <div className="space-y-4">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white rounded-2xl text-slate-900 font-black uppercase text-sm tracking-widest"
                  >
                    View Profile <User size={18} />
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl font-black uppercase text-sm tracking-widest"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full py-4 bg-yellow-500 rounded-2xl text-slate-900 font-black uppercase text-sm tracking-widest"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
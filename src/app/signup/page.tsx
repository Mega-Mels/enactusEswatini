'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Brand & Benefits */}
      <section className="hidden lg:flex relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black text-white tracking-tighter uppercase">
            Enactus<span className="text-yellow-500">Eswatini</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-black text-white mb-8 leading-tight">
            Join the <br />
            <span className="text-yellow-500 text-6xl">Youth Hub.</span>
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} className="text-yellow-500" />
              </div>
              <p className="text-slate-400 font-medium">Connect with youth, mentors, and community projects in Eswatini.</p>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} className="text-yellow-500" />
              </div>
              <p className="text-slate-400 font-medium">Learn with MTN Digital Skills Academy and track your progress.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-500 text-sm font-bold">
          <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-yellow-500" /> GDPR Compliant</span>
          <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-yellow-500" /> Data Protected</span>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="flex items-center justify-center p-8 md:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium">Join the Enactus Eswatini youth community.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-medium text-slate-900"
                  placeholder="John Dlamini"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-medium text-slate-900"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Join the Network"}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-yellow-600 font-black hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
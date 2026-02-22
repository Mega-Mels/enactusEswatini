'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
      {/* Left Side: Visual/Brand (Hidden on Mobile) */}
      <section className="hidden lg:flex relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Branding */}
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-black text-white tracking-tighter uppercase">
            Enactus<span className="text-yellow-500">Eswatini</span>
          </Link>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            Your space to <br />
            <span className="text-yellow-500 text-6xl">learn & grow.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Securely access your account to manage your learning progress and connect with the Enactus Eswatini youth community.
          </p>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center gap-4 text-slate-500 text-sm font-bold">
          <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-yellow-500" /> Secure Encryption</span>
          <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-yellow-500" /> 2FA Ready</span>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="flex items-center justify-center p-8 md:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
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

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-slate-400 hover:text-yellow-600 transition">
                  Forgot?
                </Link>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Logging In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Social / Link Footer */}
          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-yellow-600 font-black hover:underline underline-offset-4">
                Join the network
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
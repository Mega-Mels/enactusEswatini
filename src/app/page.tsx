import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, GraduationCap, Users, HeartHandshake, Sparkles } from 'lucide-react'

import enactusWordmark from '@/assets/enactus_wordmark.png'
import enactusIcon from '@/assets/enactus_icon.png'

const HERO_BG =
  'https://images.unsplash.com/photo-1758270705290-62b6294dd044?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000'

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero - Youth Community */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_BG}
            alt="Youth collaborating"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          {/* Brand row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src={enactusIcon}
                alt="Enactus"
                className="h-10 w-10 object-contain"
                priority
              />
              <div className="leading-tight">
                <p className="text-white text-sm font-black tracking-tight">Enactus Eswatini</p>
                <p className="text-slate-300 text-xs font-bold">Youth Hub • Community • Skills • Impact</p>
              </div>
            </div>

            {/* MTN badge */}
            <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-yellow-300 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} />
              Powered by MTN Digital Skills Academy
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Copy */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white mb-6">
                <Users size={14} className="text-yellow-300" />
                <span className="text-[10px] font-black uppercase tracking-widest">A youth community for Eswatini</span>
              </span>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight text-white">
                Build skills. Build confidence. <br />
                <span className="text-yellow-300">Build your future</span>.
              </h1>

              <p className="mt-6 text-base md:text-lg text-slate-200/90 max-w-2xl font-medium leading-relaxed">
                Enactus Eswatini Youth Hub is a space for young people to learn digital skills, connect with mentors, join projects,
                and access opportunities — all in one place.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-7 py-4 rounded-2xl font-black transition-all shadow-xl shadow-yellow-500/20"
                >
                  Join the Community
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/learning"
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white px-7 py-4 rounded-2xl font-black transition-all border border-white/20"
                >
                  Start Learning (MTN)
                </Link>

                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center bg-slate-950/40 hover:bg-slate-950/55 text-white px-7 py-4 rounded-2xl font-black transition-all border border-white/10"
                >
                  Support Youth Impact
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-300 text-sm font-bold">
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-300" /> Free learning pathways</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-300" /> Local community support</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-300" /> Mentors + opportunities</span>
              </div>
            </div>

            {/* Brand panel */}
            <div className="lg:col-span-5">
              <div className="rounded-[2.75rem] border border-white/15 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-2xl shadow-slate-900/30">
                <div className="flex items-center justify-center">
                  <Image
                    src={enactusWordmark}
                    alt="Enactus"
                    className="h-14 w-auto object-contain"
                    priority
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="rounded-2xl bg-slate-950/40 border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center text-yellow-200">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black">MTN Digital Skills Academy</p>
                        <p className="text-slate-300 text-sm font-medium">Your main e-learning platform</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-950/40 border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center text-yellow-200">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black">Community + Projects</p>
                        <p className="text-slate-300 text-sm font-medium">Meet peers, build teams, ship impact</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-950/40 border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center text-yellow-200">
                        <HeartHandshake size={18} />
                      </div>
                      <div>
                        <p className="text-white font-black">Donate via MTN MoMo</p>
                        <p className="text-slate-300 text-sm font-medium">Support youth access & training</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/opportunities"
                    className="text-yellow-200 font-black text-sm hover:underline"
                  >
                    Explore opportunities →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Youth Programs */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">What you can do here</h2>
            <p className="text-slate-600 font-medium">A clean path from learning → community → opportunities → impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <div className="rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Learn</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">MTN Digital Skills Academy</h3>
              <p className="mt-3 text-slate-600 font-medium leading-relaxed">Access MTN’s courses and certificates, then return here to track progress and join challenges.</p>
              <Link href="/learning" className="mt-5 inline-flex items-center gap-2 text-slate-900 font-black">
                Start learning <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Connect</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Youth Community</h3>
              <p className="mt-3 text-slate-600 font-medium leading-relaxed">Meet other young people in Eswatini, find mentors, and collaborate on real projects.</p>
              <Link href="/signup" className="mt-5 inline-flex items-center gap-2 text-slate-900 font-black">
                Join community <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grow</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Opportunities</h3>
              <p className="mt-3 text-slate-600 font-medium leading-relaxed">Explore internships, volunteering, and career opportunities shared by partners and the community.</p>
              <Link href="/opportunities" className="mt-5 inline-flex items-center gap-2 text-slate-900 font-black">
                View opportunities <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-18 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-yellow-500/20 blur-[90px] rounded-full" />
          <h2 className="relative text-3xl md:text-5xl font-black text-white mb-6">Let’s build a stronger youth future — together.</h2>
          <p className="relative text-slate-300 font-medium max-w-2xl mx-auto">
            Learn on MTN Digital Skills Academy, connect with Enactus Eswatini, and support youth access through MTN MoMo donations.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="bg-yellow-500 text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-yellow-400 transition">
              Join now
            </Link>
            <Link href="/donate" className="bg-white/10 text-white px-10 py-4 rounded-2xl font-black border border-white/15 hover:bg-white/15 transition">
              Donate via MTN MoMo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

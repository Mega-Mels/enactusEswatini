'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-client'
import DonationForm from '@/components/donations/DonationForm'
import { Heart, PieChart, Users, Zap, CheckCircle2 } from 'lucide-react'

import enactusIcon from '@/assets/enactus_icon.png'
import mtnLogo from '@/assets/partners/mtn_logo.png'
import momoLogo from '@/assets/partners/mtn_momo.png'

type RecentDonor = {
  donor_name: string | null
  amount: number
  created_at: string
}

type AllocationRow = {
  category: string
  percent: number
  active: boolean
  updated_at: string
}

type ImpactUpdate = {
  id: string
  title: string
  description: string | null
  amount_spent: number
  category: string
  created_at: string
}

const HERO_BG =
  'https://images.unsplash.com/photo-1705948482595-606e2848c65b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000'

export default function DonatePage() {
  const supabase = createClient()

  const [recentDonors, setRecentDonors] = useState<RecentDonor[]>([])
  const [allocation, setAllocation] = useState<AllocationRow[]>([])
  const [impactUpdates, setImpactUpdates] = useState<ImpactUpdate[]>([])
  const [loadingImpact, setLoadingImpact] = useState(true)

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAll = async () => {
    await Promise.all([fetchRecentDonors(), fetchAllocation(), fetchImpactUpdates()])
  }

  const fetchRecentDonors = async () => {
    const { data } = await supabase
      .from('donations')
      .select('donor_name, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    setRecentDonors((data as RecentDonor[]) || [])
  }

  const fetchAllocation = async () => {
    const { data } = await supabase
      .from('donation_allocation')
      .select('category, percent, active, updated_at')
      .eq('active', true)
      .order('percent', { ascending: false })

    setAllocation((data as AllocationRow[]) || [])
  }

  const fetchImpactUpdates = async () => {
    setLoadingImpact(true)
    const { data } = await supabase
      .from('donation_updates')
      .select('id, title, description, amount_spent, category, created_at')
      .order('created_at', { ascending: false })
      .limit(4)

    setImpactUpdates((data as ImpactUpdate[]) || [])
    setLoadingImpact(false)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const hours = Math.floor(diffInMs / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours === 1) return '1h ago'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const allocationFallback = [
    { category: 'Youth Training', percent: 60 },
    { category: 'Platform Infrastructure', percent: 20 },
    { category: 'Outreach & Growth', percent: 15 },
    { category: 'Admin', percent: 5 },
  ]

  const allocationToShow =
    allocation.length > 0 ? allocation.map((a) => ({ category: a.category, percent: Number(a.percent || 0) })) : allocationFallback

  const allocationColor = (category: string) => {
    const key = category.toLowerCase()
    if (key.includes('youth') || key.includes('training')) return 'bg-yellow-500'
    if (key.includes('platform') || key.includes('infrastructure')) return 'bg-[#001A70]'
    if (key.includes('outreach') || key.includes('growth')) return 'bg-emerald-500'
    return 'bg-slate-300'
  }

  return (
    <div className="min-h-screen bg-slate-50">
{/* MTN + Enactus Hero */}
<div className="relative overflow-hidden">
  {/* Background image */}
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src={HERO_BG} alt="Youth impact" className="absolute inset-0 h-full w-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-50/0" />

  <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-20 text-center">
    {/* Partner row */}
    <div className="flex items-center justify-center gap-3">
      <div className="rounded-2xl bg-white/95 px-4 py-2 shadow-sm border border-white/30 flex items-center gap-3">
        <Image src={mtnLogo} alt="MTN" width={64} height={24} className="h-6 w-auto" />
        <div className="h-5 w-px bg-slate-200" />
        <Image src={enactusIcon} alt="Enactus" width={22} height={22} className="h-5 w-5" />
        <span className="text-xs font-black text-slate-900">Enactus Eswatini</span>
      </div>
    </div>

    {/* MoMo pill */}
    <div className="mt-4 flex items-center justify-center">
      <div className="rounded-full bg-[#FFCB05]/95 text-[#001A70] px-4 py-2 border border-[#FFCB05]/50 shadow-sm flex items-center gap-2">
        <Image src={momoLogo} alt="MTN MoMo" width={80} height={24} className="h-5 w-auto" />
        <span className="text-[11px] font-black uppercase tracking-wider">Primary donation method</span>
      </div>
    </div>

    {/* Title */}
    <div className="mt-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white mb-6">
        <Heart size={12} className="fill-current" />
        <span className="text-[10px] font-black uppercase tracking-widest">Donate • Youth Empowerment</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
        Support Swati youth <span className="text-[#FFCB05]">skills & impact</span>
      </h1>
      <p className="mt-4 text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-medium">
        Your contributions fund learning access, certifications, devices, and community projects — powered by Enactus Eswatini and MTN.
      </p>
    </div>

    {/* Quick stats strip */}
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-200">Focus</p>
        <p className="text-sm font-black text-white mt-1">Youth digital skills</p>
      </div>
      <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-200">Method</p>
        <p className="text-sm font-black text-white mt-1">MTN MoMo (primary)</p>
      </div>
      <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-200">Impact</p>
        <p className="text-sm font-black text-white mt-1">Devices • Data • Exams</p>
      </div>
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
          {/* Left Column: Donation Form Container */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-900/10 border border-slate-200">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Make a Contribution</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                MTN MoMo is the primary donation method.
              </p>
            </div>
            <DonationForm />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Allocation */}
            <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#001A70] rounded-xl text-[#FFCB05]">
                  <PieChart size={18} />
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resource Allocation</h3>
              </div>

              <div className="space-y-6">
                {allocationToShow.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-tight">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="text-slate-400">{item.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div className={`h-full ${allocationColor(item.category)} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact Updates */}
            <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#001A70] rounded-xl text-[#FFCB05]">
                  <Zap size={18} />
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Impact Updates</h3>
              </div>

              {loadingImpact ? (
                <div className="space-y-3">
                  <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                  <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                  <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                </div>
              ) : impactUpdates.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600 font-bold">
                  No impact updates yet. Admins can post updates from the Admin panel.
                </div>
              ) : (
                <div className="space-y-4">
                  {impactUpdates.map((u) => (
                    <div key={u.id} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-900">{u.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {u.category} • {getTimeAgo(u.created_at)}
                          </p>
                          {u.description ? <p className="text-sm font-bold text-slate-600 mt-2">{u.description}</p> : null}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spent</p>
                          <p className="text-sm font-black text-emerald-600">E{Number(u.amount_spent || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Backers */}
            <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#001A70] rounded-xl text-[#FFCB05]">
                  <Users size={18} />
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Backers</h3>
              </div>

              <div className="space-y-4">
                {recentDonors.map((donor, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {donor.donor_name ? donor.donor_name[0].toUpperCase() : 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{donor.donor_name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">E{Number(donor.amount || 0)} Contribution</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase">{getTimeAgo(donor.created_at)}</span>
                  </div>
                ))}

                {recentDonors.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-slate-600 font-bold">
                    No donations yet — be the first backer.
                  </div>
                ) : null}
              </div>
            </section>

            {/* Impact scale */}
            <section className="rounded-[2rem] bg-[#001A70] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} />
              </div>
              <h3 className="mb-8 text-xl font-black tracking-tight">Impact Scale</h3>
              <ul className="space-y-5">
                {[
                  'E100 provides course materials for 2 students',
                  'E250 sponsors one certification exam',
                  'E500 covers internet for 10 learners',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 size={18} className="text-[#FFCB05] mt-0.5" />
                    <span className="text-sm font-bold text-slate-200">{text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

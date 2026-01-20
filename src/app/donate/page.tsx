'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import DonationForm from '@/components/donations/DonationForm'

type RecentDonor = {
  donor_name: string
  amount: number
  created_at: string
}

export default function DonatePage() {
  const [recentDonors, setRecentDonors] = useState<RecentDonor[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchRecentDonors()
  }, [])

  const fetchRecentDonors = async () => {
    const { data } = await supabase
      .from('donations')
      .select('donor_name, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentDonors(data || [])
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    if (hours < 48) return 'Yesterday'
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Support Our Mission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Your donation helps us train more youth and create sustainable remote work opportunities across Eswatini.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Left Column: Donation Form */}
          <div className="flex flex-col justify-start">
            <DonationForm />
          </div>

          {/* Right Column: Impact Section */}
          <div className="space-y-8">
            
            {/* Where Money Goes */}
            <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="mb-6 text-xl font-bold text-slate-900">Where Your Money Goes</h3>
              <div className="space-y-6">
                {[
                  { label: 'Youth Training Programs', percent: 60, color: 'bg-yellow-500' },
                  { label: 'Platform Maintenance', percent: 20, color: 'bg-blue-500' },
                  { label: 'Community Outreach', percent: 15, color: 'bg-green-500' },
                  { label: 'Administrative Costs', percent: 5, color: 'bg-slate-400' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm font-semibold">
                      <span>{item.label}</span>
                      <span className="text-slate-500">{item.percent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className={`h-full ${item.color} transition-all duration-1000`} 
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Donors */}
            <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="mb-6 text-xl font-bold text-slate-900">Recent Donors</h3>
              {recentDonors.length === 0 ? (
                <p className="italic text-slate-500 text-center py-4">Be the first to donate!</p>
              ) : (
                <div className="space-y-4">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                      <div>
                        <p className="font-bold text-slate-800">{donor.donor_name || 'Anonymous'}</p>
                        <p className="text-sm text-slate-500">donated E{donor.amount}</p>
                      </div>
                      <span className="text-xs font-medium text-slate-400">{getTimeAgo(donor.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Impact Stats */}
            <section className="rounded-2xl bg-slate-900 p-8 text-white shadow-lg">
              <h3 className="mb-6 text-xl font-bold">Your Impact</h3>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">✓</span> 
                  <span>E100 provides course materials for 2 students</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">✓</span> 
                  <span>E250 sponsors one certification exam</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">✓</span> 
                  <span>E500 covers internet access for 10 students</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold">✓</span> 
                  <span>E1,000 funds a full training workshop</span>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
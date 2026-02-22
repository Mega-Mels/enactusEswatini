'use client'

import Link from 'next/link'
import { Calendar, Users, ArrowRight, DollarSign, Briefcase, ExternalLink } from 'lucide-react'
import jobDefault from "@/assets/jobs/job_default.jpg";
import jobTech from "@/assets/jobs/job_tech.jpg";
import jobBusiness from "@/assets/jobs/job_business.jpg";
import jobCreative from "@/assets/jobs/job_creative.jpg";
import jobCommunity from "@/assets/jobs/job_community.jpg";
import jobRemote from "@/assets/jobs/job_remote.jpg";
import Image from 'next/image'

type JobCardProps = {
  id: string
  title: string
  company: string
  description: string
  category: string
  type: string | null
  salary_range: string
  application_count: number
  created_at: string
  application_url?: string // Added for direct links
}
function getJobImage(job: any) {
  const category = (job.category ?? '').toLowerCase()
  const type = (job.type ?? '').toLowerCase()

  if (type.includes('remote')) return jobRemote
  if (type.includes('contract')) return jobDefault // or jobBusiness if you prefer

  if (category.includes('tech')) return jobTech
  if (category.includes('business')) return jobBusiness
  if (category.includes('creative')) return jobCreative
  if (category.includes('community')) return jobCommunity
  return jobDefault
}
export default function JobCard({ 
  id, title, company, description, category, type, salary_range, application_count, created_at, application_url 
}: JobCardProps) {

  const getTypeColor = (type: string | null) => {
    if (!type) return 'bg-slate-50 text-slate-700 border-slate-100'
    switch(type.toLowerCase()) {
      case 'remote': return 'bg-indigo-50 text-indigo-700 border-indigo-100'
      case 'hybrid': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'contract': return 'bg-amber-50 text-amber-700 border-amber-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 7 ? `${days}d ago` : `${Math.floor(days / 7)}w ago`
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-yellow-400/50 transition-all duration-300 group flex flex-col justify-between h-full">
      <div>
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{company}</p>
              <h3 className="text-lg font-black text-slate-900 line-clamp-1 group-hover:text-yellow-600 transition-colors tracking-tight">
                {title}
              </h3>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            application_count > 40 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <Users className="w-3 h-3" />
            {application_count || 0}
          </div>
        </div>
          <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100">
          <Image
            src={getJobImage({ category, type })}
            alt="Job cover"
            className="h-32 w-full object-cover"
            priority={false}
          />
</div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getTypeColor(type)}`}>
            {type || 'Full-time'}
          </span>
          <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
            {category}
          </span>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
          {description}
        </p>
      </div>

      <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-slate-900 font-black text-sm">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            {salary_range || 'Competitive'}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            <Calendar className="w-3 h-3" />
            {getDaysAgo(created_at)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {application_url && (
            <a 
              href={application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-yellow-500 text-slate-900 rounded-xl text-xs font-black hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/10"
            >
              Apply <ExternalLink size={14} className="ml-1.5" />
            </a>
          )}
          <Link 
            href={`/opportunities/${id}`}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import JobCard from '@/components/jobs/JobCard'
import JobFilter from '@/components/jobs/JobFilter'
import { Search, SlidersHorizontal, Briefcase, Sparkles } from 'lucide-react'
import { requireUser } from '@/lib/auth'


type Job = {
  id: string
  title: string
  company: string
  description: string
  category: string
  job_type: string
  type: string | null
  location: string
  resource_url: string
  salary_range: string
  application_count: number
  created_at: string
}

<div className="mt-6 grid gap-4 md:grid-cols-3">
  <a className="rounded-2xl border p-5 hover:shadow" href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer">
    <div className="font-bold">LinkedIn Jobs</div>
    <div className="text-sm opacity-80">Search “Eswatini” + filters</div>
  </a>

  <a className="rounded-2xl border p-5 hover:shadow" href="https://www.indeed.com/" target="_blank" rel="noreferrer">
    <div className="font-bold">Indeed</div>
    <div className="text-sm opacity-80">Local + international roles</div>
  </a>

  <a className="rounded-2xl border p-5 hover:shadow" href="https://remoteok.com/" target="_blank" rel="noreferrer">
    <div className="font-bold">RemoteOK</div>
    <div className="text-sm opacity-80">Remote roles (tech + more)</div>
  </a>
</div>

export default function OpportunitiesPage() {
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    let result = jobs

    if (selectedTypes.length > 0) {
  const set = new Set(selectedTypes.map(t => t.toLowerCase()))
  result = result.filter(job => set.has((job.type ?? '').toLowerCase()))
}

type JobFilterProps = {
  activeFilter: string
  onFilterChange: (filter: string) => void
  selectedTypes: string[]
  onToggleType: (type: string) => void
}



    if (activeFilter !== "all") {
      const filter = activeFilter.toLowerCase();
      result = result.filter((job) => (job.category ?? "").toLowerCase() === filter);
    }
    if (searchQuery) {
  const q = searchQuery.toLowerCase();
  result = result.filter((job) =>
    [
      job.title ?? "",
      job.company ?? "",
      //job.location ?? "",
      job.category ?? "",
      //job.type ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}
    setFilteredJobs(result)
  }, [activeFilter, searchQuery, jobs])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
      setFilteredJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* High-Contrast Header Section */}
      <div className="bg-slate-900 pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-6">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">New Leads Daily</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            Global <span className="text-yellow-500">Opportunities.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
            Curated internships, volunteering, and career opportunities for young people in Eswatini.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        {/* Modern Search Bar */}
        <div className="max-w-4xl mx-auto bg-white p-3 rounded-3xl shadow-2xl shadow-slate-900/10 flex flex-col md:flex-row gap-3 mb-12 border border-slate-100">
          <div className="flex-grow flex items-center px-4 bg-slate-50 rounded-2xl border border-slate-100 group focus-within:border-yellow-500 transition-colors">
            <Search className="text-slate-400 w-5 h-5 mr-3 group-focus-within:text-yellow-500" />
            <input 
              type="text"
              placeholder="Search by role or company..."
              className="w-full py-4 bg-transparent outline-none text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-black px-10 py-4 rounded-2xl transition-all active:scale-[0.98]">
            Filter Leads
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-900">
                <SlidersHorizontal size={18} className="text-yellow-500" />
                <h3 className="font-black uppercase tracking-widest text-xs">Refine Search</h3>
              </div>
              
              <JobFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Employment Type</h4>
                <div className="space-y-4">
                  {['Remote', 'Hybrid', 'Contract'].map((type) => (
                    <label key={type} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-yellow-500 checked:border-yellow-500 transition-all cursor-pointer" />
                        <div className="absolute opacity-0 peer-checked:opacity-100 text-slate-900 pointer-events-none">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job Feed */}
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-bold">
                Found <span className="text-slate-900 font-black px-2 py-1 bg-yellow-500/10 rounded-md">{filteredJobs.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort by:</span>
                <select className="bg-transparent border-none text-sm font-black text-slate-900 focus:ring-0 cursor-pointer">
                  <option>Recent First</option>
                  <option>Compensation</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-white border border-slate-200 animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No leads found</h3>
                <p className="text-slate-500 font-medium mb-8">Try broadening your search or switching categories.</p>
                <button
                  onClick={() => {setActiveFilter('all'); setSearchQuery('')}}
                  className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-2xl font-black hover:bg-yellow-400 transition shadow-lg shadow-yellow-200"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
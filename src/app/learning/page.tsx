'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-client'
import CourseCard from '@/components/courses/CourseCard'
import { GraduationCap, Filter, ExternalLink } from 'lucide-react'

import enactusIcon from '@/assets/enactus_icon.png'
import mtnLogo from '@/assets/partners/mtn_logo.png'
import mtnSkills from '@/assets/partners/mtn_digital_skills.png'

type Course = {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url: string | null
  is_external: boolean
  is_certified: boolean
  enrollment_count: number
  resource_url: string | null
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'Technical', 'Business', 'Soft Skills', 'Data Analytics']

  const filteredCourses = activeCategory === 'all' ? courses : courses.filter((c) => c.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* MTN Digital Skills Academy Hero */}
      <header className="bg-[#FFCB05] pt-10 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
  {/* Left */}
  <div className="text-center lg:text-left">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-black/10 text-[#001A70] mb-5">
      <div className="flex items-center gap-2">
        <Image src={mtnLogo} alt="MTN" width={64} height={24} className="h-5 w-auto" />
        <Image src={enactusIcon} alt="Enactus" width={18} height={18} className="h-4 w-4" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">Enactus Eswatini • Learning</span>
    </div>

    <h1 className="text-3xl md:text-6xl font-black text-[#001A70] tracking-tighter leading-tight">
      MTN Digital Skills Academy
    </h1>

    <p className="mt-4 text-sm md:text-base text-[#001A70]/80 max-w-2xl font-semibold mx-auto lg:mx-0">
      This page is built around MTN Digital Skills Academy as the primary platform. Learn with MTN, then come back here
      to connect with the Enactus Eswatini youth community and explore opportunities.
    </p>

    <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
      <a
        href="https://skillsacademy.mtn.com/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#001A70] text-white px-6 py-4 font-black hover:opacity-95 transition"
      >
        Open MTN Skills Academy <ExternalLink size={16} />
      </a>

      <a
        href="#catalog"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/70 px-6 py-4 font-black text-[#001A70] hover:bg-white transition border border-black/10"
      >
        Browse local modules
      </a>
    </div>
  </div>
  </div>

  {/* Right */}
  <div className="w-full">
    <div className="bg-white/80 border border-black/10 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Image src={mtnSkills} alt="MTN Digital Skills Academy" width={220} height={64} className="h-14 w-auto" />
        <span className="text-[10px] font-black text-[#001A70] bg-[#FFCB05] px-3 py-1 rounded-full border border-black/10">
          Official Partner
        </span>
      </div>

      <p className="mt-4 text-sm text-[#001A70]/80 font-semibold">
        Learn for free with MTN Digital Skills Academy, then return here for community, opportunities, and support.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {['AI Basics', 'CV & Career', 'Digital Business'].map((t) => (
          <div key={t} className="rounded-xl bg-[#FFCB05]/20 border border-black/10 px-3 py-2 text-center">
            <span className="text-[10px] font-black text-[#001A70] uppercase tracking-wider">{t}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
      </header>

      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#001A70] rounded-lg text-[#FFCB05]">
              <Filter size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter by Stream</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all tracking-tight ${
                  activeCategory === category
                    ? 'bg-[#001A70] text-white shadow-lg shadow-slate-900/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {category === 'all' ? 'All Modules' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-[2rem] bg-slate-200 border border-slate-100" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
              <GraduationCap size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">No modules found</h3>
            <p className="text-slate-500 font-medium">We're currently updating this stream with new content.</p>
            <button onClick={() => setActiveCategory('all')} className="mt-6 text-[#001A70] font-black text-sm hover:underline">
              Back to all modules
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <footer className="mt-20 border-t border-slate-200 pt-10 text-center">
            <div className="inline-flex items-center gap-6 px-8 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 leading-none">{courses.length}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Modules</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 leading-none">
                  {courses.reduce((sum, c) => sum + c.enrollment_count, 0).toLocaleString()}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Learners</span>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

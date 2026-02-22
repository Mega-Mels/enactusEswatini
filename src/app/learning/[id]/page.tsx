import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ExternalLinkButton from '@/components/courses/ExternalLinkButton'
import { ArrowLeft, GraduationCap, Award, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { requireUser } from '@/lib/auth'


type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  await requireUser()
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch course details
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !course) {
    notFound()
  }

  // 2. Get current user for access control
  const { data: { user } } = await supabase.auth.getUser()

  const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop'

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header / Navigation */}
      <div className="bg-slate-900 pt-12 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/learning" 
            className="group inline-flex items-center text-sm font-black text-slate-400 hover:text-white mb-8 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Academy
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-yellow-500">
              {course.category}
            </span>
            {course.is_certified && (
              <span className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <Award size={14} /> Global Certification
              </span>
            )}
          </div>
          <h1 className="max-w-4xl text-4xl font-black text-white sm:text-6xl tracking-tighter leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2">
            <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-200 border-8 border-white">
              <Image
                src={course.thumbnail_url || defaultThumbnail}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-slate max-w-none bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Curriculum Overview</h2>
              <p className="text-lg leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                {course.description}
              </p>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="text-yellow-500 shrink-0" size={20} />
                    <span className="text-sm font-bold text-slate-700">Self-paced learning modules</span>
                 </div>
                 <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="text-yellow-500 shrink-0" size={20} />
                    <span className="text-sm font-bold text-slate-700">Industry-recognized badge</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Access Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
              <div className="mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-yellow-500">
                   <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Access Course</h3>
                <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
                  This specialized training is hosted on a verified external partner platform. 
                </p>
              </div>

              {user ? (
                <div className="space-y-4">
                  <ExternalLinkButton 
                    resourceUrl={course.resource_url || '#'} 
                  />
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Globe size={12} /> External Redirect
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
                    <ShieldCheck className="mx-auto mb-3 text-slate-300" size={32} />
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      Enactus Eswatini Youth Hub members get priority access to this certification.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/login"
                      className="block w-full rounded-xl bg-slate-900 px-6 py-4 font-black text-white transition hover:bg-slate-800 shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                    >
                      Sign In to Access
                    </Link>
                    <Link
                      href="/signup"
                      className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-yellow-600 transition"
                    >
                      Register Free Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApplicationForm from '@/components/jobs/ApplicationForm'
import { requireUser } from '@/lib/auth'
import { ArrowLeft, MapPin, Briefcase, Building2, Calendar, DollarSign, ExternalLink, CheckCircle2 } from 'lucide-react'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: PageProps) {
  await requireUser()
  const { id } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !job) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let hasApplied = false
  if (user) {
    const { data: application } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    hasApplied = !!application
  }

  const getTypeColor = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'remote': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'hybrid': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'contract': return 'bg-amber-50 text-amber-600 border-amber-100'
      default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/opportunities" 
          className="group inline-flex items-center text-sm font-black text-slate-400 hover:text-slate-900 mb-10 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
              <div className="flex flex-wrap gap-3 mb-8">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getTypeColor(job.job_type)}`}>
                  {job.job_type}
                </span>
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                  {job.category}
                </span>
              </div>

              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">
                {job.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-500 mb-10">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Building2 size={18} className="text-slate-400" />
                  {job.company}
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <DollarSign size={18} className="text-emerald-500" />
                  <span className="text-slate-900">{job.salary_range}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Calendar size={18} className="text-slate-400" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-10">
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Job Description</h3>
                  <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                    {job.description}
                  </div>
                </section>
                
                {job.requirements && (
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Requirements</h3>
                    <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {job.requirements}
                    </div>
                  </section>
                )}
              </div>

              {job.external_url && (
                <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <ExternalLink className="text-yellow-500" size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">Apply Externally</h4>
                      <p className="text-slate-400 text-sm font-medium">This application is hosted on the company's official portal.</p>
                    </div>
                  </div>
                  <a 
                    href={job.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-yellow-500 text-slate-900 py-4 rounded-xl font-black hover:bg-yellow-400 transition shadow-xl shadow-yellow-500/10"
                  >
                    Go to Application Portal
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 sticky top-24">
              {user ? (
                hasApplied ? (
                  <div className="text-center py-6">
                    <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Saved to Profile</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      You've expressed interest in this role. Check your dashboard to track your career progress.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Apply for Role</h3>
                    <ApplicationForm jobId={id} jobTitle={job.title} />
                  </div>
                )
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Briefcase size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Join the Network</h3>
                  <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                    You must be a member of the Enactus Eswatini Youth Hub to apply for this opportunity.
                  </p>
                  <div className="space-y-4">
                    <Link 
                      href="/login" 
                      className="block w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block w-full border border-slate-200 text-slate-700 py-4 rounded-xl font-black hover:bg-slate-50 transition"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
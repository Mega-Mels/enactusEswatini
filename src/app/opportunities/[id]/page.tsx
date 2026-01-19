import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ApplicationForm from '@/components/jobs/ApplicationForm'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch job details
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user already applied
  let hasApplied = false
  if (user) {
    const { data: application } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', user.id)
      .maybeSingle() // Use maybeSingle to avoid errors if no application exists

    hasApplied = !!application
  }

  const getTypeColor = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'remote': return 'bg-blue-100 text-blue-700'
      case 'hybrid': return 'bg-green-100 text-green-700'
      case 'contract': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/opportunities" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8"
        >
          ← Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(job.job_type)}`}>
                  {job.job_type?.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                  {job.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{job.company}</p>

              <div className="flex items-center text-gray-500 text-sm gap-4 mb-8">
                <span className="font-bold text-green-600">{job.salary_range}</span>
                <span>•</span>
                <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
              </div>

              <div className="prose prose-yellow max-w-none">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{job.description}</p>
                
                {job.requirements && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
                    <p className="text-gray-600 leading-relaxed">{job.requirements}</p>
                  </>
                )}
              </div>

              {job.external_url && (
                <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <p className="text-sm text-yellow-800 mb-3 font-medium">This position is hosted externally:</p>
                  <a 
                    href={job.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
                  >
                    View on company website →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Application Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              {user ? (
                hasApplied ? (
                  <div className="text-center py-6">
                    <div className="bg-green-100 text-green-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      ✅
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Application Submitted</h3>
                    <p className="text-sm text-gray-500">
                      You've already applied for this position. We'll notify you of any updates.
                    </p>
                  </div>
                ) : (
                  <ApplicationForm jobId={id} jobTitle={job.title} />
                )
              ) : (
                <div className="text-center py-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    You need to be logged in to apply for this position.
                  </p>
                  <div className="space-y-3">
                    <Link 
                      href="/login" 
                      className="block w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block w-full border border-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-50 transition"
                    >
                      Sign Up
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
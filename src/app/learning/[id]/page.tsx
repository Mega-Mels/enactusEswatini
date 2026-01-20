import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ExternalLinkButton from '@/components/courses/ExternalLinkButton'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
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
      {/* Top Navigation */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link 
          href="/learning" 
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          ← Back to Courses
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2">
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl shadow-xl bg-slate-200">
              <Image
                src={course.thumbnail_url || defaultThumbnail}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                {course.category}
              </span>
              {course.is_certified && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                  ✓ CERTIFIED
                </span>
              )}
            </div>

            <h1 className="mb-4 text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
              {course.title}
            </h1>

            <div className="prose prose-slate max-w-none border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-bold text-slate-900">About This Course</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {course.description}
              </p>
            </div>
          </div>

          {/* Right Column: Access Card */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Course Access</h3>
                <p className="mt-2 text-sm text-slate-500">
                  This certification is hosted on an external platform. 
                </p>
              </div>

              {user ? (
                <div className="space-y-4">
                  <ExternalLinkButton 
                    resourceUrl={course.resource_url || '#'} 
                  />
                  <p className="text-[11px] text-center text-slate-400 italic">
                    You will be redirected to the official provider.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-600">
                      Please log in to your account to access the course materials.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      className="block w-full rounded-lg bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-slate-800"
                    >
                      Log In to Access
                    </Link>
                    <Link
                      href="/signup"
                      className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                      Create an account
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
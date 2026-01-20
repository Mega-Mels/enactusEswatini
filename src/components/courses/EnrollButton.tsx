'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

type EnrollButtonProps = {
  courseId: string
  courseTitle: string
}

export default function EnrollButton({ courseId, courseTitle }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleEnroll = async () => {
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        throw new Error('You must be logged in to enroll')
      }

      // 1. Create enrollment
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          progress: 0,
          completed: false
        })

      if (enrollError) {
        if (enrollError.code === '23505') {
          throw new Error('You are already enrolled in this course.')
        }
        throw enrollError
      }

      // 2. Increment enrollment count via RPC
      const { error: updateError } = await supabase.rpc('increment_enrollment_count', {
        course_id: courseId // Ensure this matches your SQL function argument name
      })

      if (updateError) console.error('Count update failed:', updateError)

      // 3. Refresh the page to update the UI (shows "Enrolled" state)
      router.refresh()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-6 border border-slate-200">
      <div className="space-y-1">
        <h4 className="font-bold text-slate-900">Enroll in This Course</h4>
        <p className="text-sm text-slate-600">
          Start learning <span className="font-medium text-blue-600">{courseTitle}</span> today and add this certification to your profile.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={loading}
        className={`w-full rounded-lg py-3 text-center font-bold text-white transition-all shadow-md active:scale-[0.98] ${
          loading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Enrolling...
          </span>
        ) : (
          'Enroll Now (Free)'
        )}
      </button>

      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-green-500">✓</span> Free enrollment
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-green-500">✓</span> Lifetime access
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-green-500">✓</span> Certificate upon completion
        </div>
      </div>
    </div>
  )
}
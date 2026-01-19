'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

type ApplicationFormProps = {
  jobId: string
  jobTitle: string
}

export default function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to apply')
      }

      // Submit application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          user_id: user.id,
          cover_letter: coverLetter,
          status: 'pending'
        })

      if (applicationError) throw applicationError

      // Increment application count using a Postgres Function
      const { error: updateError } = await supabase.rpc('increment_application_count', {
        row_id: jobId // Note: ensured the parameter name matches standard RPC patterns
      })

      // Refresh to show the 'Success' state in JobDetailPage
      router.refresh()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Apply for this Position</h3>
        <p className="text-sm text-gray-500 mt-1">Submit your application for {jobTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="cover-letter" className="block text-sm font-bold text-gray-700 mb-2">
            Cover Letter / Why you're a good fit *
          </label>
          <textarea
            id="cover-letter"
            required
            rows={8}
            minLength={50}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-700"
            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <p className="mt-2 text-[11px] text-gray-400">
            Minimum 50 characters. Be specific about your relevant skills and experience.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start">
          <span className="text-lg">📄</span>
          <p className="text-xs text-blue-700 leading-relaxed">
            Your profile information and resume (if uploaded) will be automatically included with this application.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || coverLetter.length < 50}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200"
        >
          {loading ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
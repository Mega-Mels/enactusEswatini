'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

type Props = {
  resourceUrl: string
}

export default function ExternalLinkButton({ resourceUrl }: Props) {
  const [isVerifying, setIsVerifying] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleExternalClick = async () => {
    setIsVerifying(true)
    
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // 2. If not logged in, send them to login
      router.push('/login')
      return
    }

    // 3. Open the external course link immediately
    window.open(resourceUrl, '_blank', 'noopener,noreferrer')
    setIsVerifying(false)
  }

  return (
    <button
      onClick={handleExternalClick}
      disabled={isVerifying}
      className={`w-full rounded-lg px-6 py-4 text-center font-bold text-white transition-all shadow-md active:scale-95 ${
        isVerifying ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isVerifying ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Verifying Access...
        </span>
      ) : (
        'Go to Course →'
      )}
    </button>
  )
}
'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function RateLimitToast() {
  useEffect(() => {
    toast.error('API Limit Reached', {
      description: 'Please add your own Gemini API Key in settings or check your quota.',
      duration: 10000,
    })
  }, [])

  return null
}

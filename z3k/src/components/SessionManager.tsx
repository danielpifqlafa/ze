'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useActiveSession } from '@/contexts/ActiveSessionContext'

export function SessionManager() {
  const pathname = usePathname()
  const { addOrUpdateSession, updateSessionStatus } = useActiveSession()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUserId = localStorage.getItem('userId')
      if (storedUserId) {
        setUserId(storedUserId)
      } else {
        const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('userId', newUserId)
        setUserId(newUserId)
      }
    }
  }, [])

  useEffect(() => {
    if (userId && pathname) {
      addOrUpdateSession(userId, pathname, 'active')
    }

    const handleVisibilityChange = () => {
      if (userId) {
        updateSessionStatus(userId, document.hidden ? 'inactive' : 'active')
      }
    }

    const handleBeforeUnload = () => {
      if (userId) {
        // Use sendBeacon for more reliable data sending when page is unloading
        navigator.sendBeacon('/api/sessions', JSON.stringify({
          method: 'POST',
          user: userId,
          status: 'inactive'
        }))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [addOrUpdateSession, updateSessionStatus, pathname, userId])

  return null
}
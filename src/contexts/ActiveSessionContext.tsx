'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@prisma/client'

type Event = {
  type: 'navigate' | 'refreshSessions' | 'updateStatus'
  userId?: string
  page?: string
  status?: string
  timestamp: number
}

type ActiveSessionContextType = {
  sessions: Session[]
  addOrUpdateSession: (user: string, page: string, status: string) => Promise<void>
  refreshSessions: () => Promise<void>
  navigateUser: (userId: string, page: string) => void
  deleteSession: (userId: string) => Promise<void>
  updateSessionStatus: (userId: string, status: string) => Promise<void>
}

const ActiveSessionContext = createContext<ActiveSessionContextType | undefined>(undefined)

export const useActiveSession = () => {
  const context = useContext(ActiveSessionContext)
  if (!context) {
    throw new Error('useActiveSession must be used within an ActiveSessionProvider')
  }
  return context
}

export const ActiveSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const router = useRouter()
  const lastTimestampRef = useRef(0)

  const pollEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?lastTimestamp=${lastTimestampRef.current}`)
      if (response.ok) {
        const newEvents: Event[] = await response.json()
        newEvents.forEach((event: Event) => {
          if (event.type === 'navigate' && event.userId === localStorage.getItem('userId') && event.page) {
            router.push(event.page)
          } else if (event.type === 'refreshSessions') {
            refreshSessions()
          } else if (event.type === 'updateStatus') {
            refreshSessions()
          }
          lastTimestampRef.current = Math.max(lastTimestampRef.current, event.timestamp)
        })
      }
    } catch (error) {
      console.error('Error polling events:', error)
    }
  }, [router])

  useEffect(() => {
    const interval = setInterval(pollEvents, 1000) // Poll every second
    return () => clearInterval(interval)
  }, [pollEvents])

  const addOrUpdateSession = useCallback(async (user: string, page: string, status: string) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, page, status }),
      })
      if (response.ok) {
        const updatedSession: Session = await response.json()
        setSessions(prev => {
          const index = prev.findIndex(s => s.id === updatedSession.id)
          if (index !== -1) {
            return [...prev.slice(0, index), updatedSession, ...prev.slice(index + 1)]
          } else {
            return [...prev, updatedSession]
          }
        })
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'refreshSessions' as const }),
        })
      }
    } catch (error) {
      console.error('Error adding or updating session:', error)
    }
  }, [])

  const refreshSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const latestSessions: Session[] = await response.json()
        setSessions(latestSessions)
      }
    } catch (error) {
      console.error('Error refreshing sessions:', error)
    }
  }, [])

  const navigateUser = useCallback(async (userId: string, page: string) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'navigate' as const, userId, page }),
      })
    } catch (error) {
      console.error('Error navigating user:', error)
    }
  }, [])

  const deleteSession = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userId }),
      })
      if (response.ok) {
        setSessions(prev => prev.filter(session => session.user !== userId))
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'refreshSessions' as const }),
        })
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }, [])

  const updateSessionStatus = useCallback(async (userId: string, status: string) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userId, status }),
      })
      if (response.ok) {
        const updatedSession: Session = await response.json()
        setSessions(prev => prev.map(session =>
          session.user === userId ? updatedSession : session
        ))
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'updateStatus' as const, userId, status }),
        })
      }
    } catch (error) {
      console.error('Error updating session status:', error)
    }
  }, [])

  useEffect(() => {
    refreshSessions()
    const interval = setInterval(refreshSessions, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [refreshSessions])

  const value: ActiveSessionContextType = {
    sessions,
    addOrUpdateSession,
    refreshSessions,
    navigateUser,
    deleteSession,
    updateSessionStatus,
  }

  return (
    <ActiveSessionContext.Provider value={value}>
      {children}
    </ActiveSessionContext.Provider>
  )
}

export default ActiveSessionProvider
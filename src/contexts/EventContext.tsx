"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'

type EventContextType = {
  eventId: string | null
  setEventId: (id: string | null) => void
}

const EventContext = createContext<EventContextType>({} as EventContextType)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [eventId, setEventIdState] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentEventId')
    if (stored) setEventIdState(stored)
  }, [])

  const setEventId = (id: string | null) => {
    setEventIdState(id)
    if (id) localStorage.setItem('currentEventId', id)
    else localStorage.removeItem('currentEventId')
  }

  return (
    <EventContext.Provider value={{ eventId, setEventId }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  return useContext(EventContext)
}



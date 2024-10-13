import { NextApiRequest, NextApiResponse } from 'next'

type Event = {
  type: 'navigate' | 'refreshSessions'
  userId?: string
  page?: string
  timestamp: number
}

let events: Event[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const event: Event = {
      ...req.body,
      timestamp: Date.now()
    }
    events.push(event)
    res.status(200).json({ message: 'Event added' })
  } else if (req.method === 'GET') {
    const { lastTimestamp = 0 } = req.query
    const newEvents = events.filter(event => event.timestamp > Number(lastTimestamp))
    res.status(200).json(newEvents)
  } else {
    res.status(405).end()
  }
}
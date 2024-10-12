import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sessions = await prisma.session.findMany()
      res.status(200).json(sessions)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sessions', error })
    }
  } else if (req.method === 'POST') {
    try {
      let { user, page, status } = req.body
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'

      // Handle beacon request
      if (req.headers['content-type'] === 'text/plain;charset=UTF-8') {
        const beaconData = JSON.parse(req.body)
        user = beaconData.user
        status = beaconData.status
      }

      const existingSession = await prisma.session.findFirst({
        where: { user },
      })

      let session
      if (existingSession) {
        session = await prisma.session.update({
          where: { id: existingSession.id },
          data: {
            page: page || existingSession.page,
            location: ip as string,
            lastActive: new Date(),
            status: status || existingSession.status,
          },
        })
      } else {
        session = await prisma.session.create({
          data: {
            user,
            page: page || '/',
            location: ip as string,
            lastActive: new Date(),
            status: status || 'active',
          },
        })
      }

      res.status(200).json(session)
    } catch (error) {
      res.status(500).json({ message: 'Error adding or updating session', error })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { user } = req.body
      await prisma.session.deleteMany({
        where: { user },
      })
      res.status(200).json({ message: 'Session deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting session', error })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
import { Server as SocketIOServer } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { Server as HttpServer } from 'http'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface SocketIONextApiResponse extends NextApiResponse {
  socket: NetSocket & {
    server: HttpServer & {
      io: SocketIOServer | undefined
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: SocketIONextApiResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
    res.end()
    return
  }

  console.log('Socket is initializing')
  const io = new SocketIOServer(res.socket.server as any, {
    path: '/api/socketio',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  res.socket.server.io = io

  io.on('connection', (socket) => {
    console.log('New client connected')

    socket.on('join', (userId) => {
      socket.join(userId)
      console.log(`User ${userId} joined`)
    })

    socket.on('navigate', (data) => {
      socket.to(data.userId).emit('navigate', data.page)
      console.log(`Navigating user ${data.userId} to ${data.page}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  console.log('Socket is initialized')
  res.end()
}

export default SocketHandler
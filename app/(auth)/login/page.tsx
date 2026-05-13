'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DhlLogo } from '@/components/dhl-logo'
import { LoadingSpinner } from '@/components/loading-spinner'
import { login, getCurrentUser } from '@/lib/auth-store'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = login(formData.email, formData.password)

    if (result.success) {
      toast.success('Welcome back!', {
        description: `Signed in as ${result.user?.name}`
      })
      router.push('/dashboard')
    } else {
      toast.error('Login failed', {
        description: result.error
      })
      setIsLoading(false)
    }
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <DhlLogo size="lg" className="text-white" />
      </div>

      {/* Login Card */}
      <div className="bg-[#1E1E1E] rounded-xl p-8 shadow-2xl border border-white/5">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-[#AAAAAA] mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
              <Input
                id="email"
                type="email"
                placeholder="you@dhl.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-[#141414] border-[#333] text-white placeholder:text-[#666] focus:border-dhl-red focus:ring-dhl-red"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 bg-[#141414] border-[#333] text-white placeholder:text-[#666] focus:border-dhl-red focus:ring-dhl-red"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-dhl-red hover:bg-dhl-red/90 text-white font-semibold h-11 transition-transform active:scale-[0.97]"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#AAAAAA] text-sm">
            {"Don't have an account? "}
            <Link href="/signup" className="text-dhl-yellow hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>


    </motion.div>
  )
}

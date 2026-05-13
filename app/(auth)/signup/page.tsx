'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, BadgeCheck, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DhlLogo } from '@/components/dhl-logo'
import { LoadingSpinner } from '@/components/loading-spinner'
import { signup, getCurrentUser } from '@/lib/auth-store'
import type { UserRole } from '@/lib/types'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
    employeeId: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push('/dashboard')
    }
  }, [router])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.role) {
      newErrors.role = 'Role is required'
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role as UserRole,
      employeeId: formData.employeeId
    })

    if (result.success) {
      toast.success('Account created!', {
        description: 'Please sign in with your new credentials'
      })
      router.push('/login')
    } else {
      toast.error('Signup failed', {
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

      {/* Signup Card */}
      <div className="bg-[#1E1E1E] rounded-xl p-8 shadow-2xl border border-white/5">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-[#AAAAAA] mt-1">Join the ResolvIQ platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-[#141414] border-[#333] text-white placeholder:text-[#666] focus:border-dhl-red focus:ring-dhl-red"
              />
            </div>
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Email */}
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
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 bg-[#141414] border-[#333] text-white placeholder:text-[#666] focus:border-dhl-red focus:ring-dhl-red"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 pr-10 bg-[#141414] border-[#333] text-white placeholder:text-[#666] focus:border-dhl-red focus:ring-dhl-red"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
          </div>

          {/* Role & Employee ID Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger className="bg-[#141414] border-[#333] text-white focus:border-dhl-red focus:ring-dhl-red">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#AAAAAA]" />
                    <SelectValue placeholder="Select role" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-[#333]">
                  <SelectItem value="Reporter" className="text-white focus:bg-dhl-red/20 focus:text-white">
                    Reporter
                  </SelectItem>
                  <SelectItem value="Resolver" className="text-white focus:bg-dhl-red/20 focus:text-white">
                    Resolver
                  </SelectItem>
                  <SelectItem value="Admin" className="text-white focus:bg-dhl-red/20 focus:text-white">
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-red-400">{errors.role}</p>}
            </div>

            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-xs font-semibold uppercase tracking-wide text-[#AAAAAA]">
                Employee ID
              </Label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="DHL-XXXX"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="pl-10 bg-[#141414] border-[#333] text-white placeholder:text-[#666] focus:border-dhl-red focus:ring-dhl-red"
                />
              </div>
              {errors.employeeId && <p className="text-xs text-red-400">{errors.employeeId}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-dhl-red hover:bg-dhl-red/90 text-white font-semibold h-11 transition-transform active:scale-[0.97] mt-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#AAAAAA] text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-dhl-yellow hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { DhlLogo } from '@/components/DhlLogo'
import { Toast } from '@/components/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setToast({ message: 'Login successful! Redirecting...', type: 'success' })
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      setToast({ message: 'Login failed. Please check your credentials.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-diagonal-lines"></div>
      <div className="absolute inset-0 bg-red-glow"></div>
      <div className="absolute inset-0 bg-yellow-glow"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="card-dark p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <DhlLogo size="large" showSubtitle={true} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-text text-dhl-muted">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dhl-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field bg-dhl-dark border-dhl-border text-white pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-text text-dhl-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dhl-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field bg-dhl-dark border-dhl-border text-white pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dhl-muted hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo hints */}
          <div className="mt-6 p-4 bg-dhl-red/10 border border-dhl-red/30 rounded-lg">
            <p className="text-xs text-dhl-muted mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p><span className="text-dhl-yellow">Admin:</span> admin@dhl.com / admin123</p>
              <p><span className="text-dhl-yellow">Resolver:</span> resolver@dhl.com / resolver123</p>
              <p><span className="text-dhl-yellow">Reporter:</span> reporter@dhl.com / reporter123</p>
            </div>
          </div>

          {/* Link to signup */}
          <div className="mt-6 text-center">
            <p className="text-dhl-muted text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-dhl-yellow hover:text-yellow-400 font-semibold">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

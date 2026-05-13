'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  BadgeCheck,
  Shield,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageTransition } from '@/components/page-transition'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ConfirmModal } from '@/components/confirm-modal'
import { getCurrentUser, updateProfile, deleteAccount, logout } from '@/lib/auth-store'
import type { User as UserType } from '@/lib/types'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    employeeId: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setProfileData({
        name: currentUser.name,
        email: currentUser.email,
        employeeId: currentUser.employeeId
      })
    }
    setIsLoading(false)
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSavingProfile(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = updateProfile(user.id, profileData)

    if (result.success) {
      setUser(result.user!)
      toast.success('Profile Updated', {
        description: 'Your profile has been saved'
      })
    } else {
      toast.error('Update Failed', {
        description: result.error
      })
    }

    setIsSavingProfile(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.currentPassword !== 'password123') {
      toast.error('Current password is incorrect')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setIsSavingPassword(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    toast.success('Password Updated', {
      description: 'Your password has been changed'
    })

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    setIsSavingPassword(false)
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    deleteAccount(user.id)
    logout()
    toast.success('Account Deleted')
    router.push('/signup')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageTransition className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="bg-card rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-dhl-red flex items-center justify-center">
                <span className="text-xl font-bold text-dhl-yellow">
                  {getInitials(user.name)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dhl-red/10 text-dhl-red mt-1">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Employee ID
              </Label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="employeeId"
                  value={profileData.employeeId}
                  onChange={(e) => setProfileData({ ...profileData, employeeId: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Role
              </Label>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/50 border">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{user.role}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Cannot be changed
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSavingProfile}
              className="bg-dhl-red hover:bg-dhl-red/90 text-white font-semibold transition-transform active:scale-[0.97]"
            >
              {isSavingProfile ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </motion.div>

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
          className="bg-card rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSavingPassword}
              className="bg-dhl-red hover:bg-dhl-red/90 text-white font-semibold transition-transform active:scale-[0.97]"
            >
              {isSavingPassword ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
          className="bg-card rounded-lg p-6 shadow-sm border-2 border-red-200"
        >
          <h2 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(true)}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete Account
          </Button>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
        requireConfirmation="DELETE"
      />
    </PageTransition>
  )
}

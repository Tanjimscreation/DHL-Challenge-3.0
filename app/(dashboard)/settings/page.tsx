'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Shield, 
  LogOut,
  Save,
  Bell,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Toast } from '@/components/Toast'
import { ConfirmModal } from '@/components/ConfirmModal'

interface Profile {
  id: string
  name: string
  email: string
  role: string
  employee_id: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee_id: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userRole, setUserRole] = useState('Admin') // Would come from auth

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        
        if (response.ok) {
          setProfile(data.profile)
          setFormData({
            name: data.profile.name || '',
            email: data.profile.email || '',
            employee_id: data.profile.employee_id || ''
          })
        } else {
          setToast({ message: 'Failed to fetch profile', type: 'error' })
        }
      } catch (error) {
        setToast({ message: 'Error fetching profile', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      setToast({ message: 'Name and email are required', type: 'warning' })
      return
    }

    setIsSaving(true)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setToast({ message: 'Profile updated successfully', type: 'success' })
      } else {
        setToast({ message: 'Failed to update profile', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error updating profile', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      return
    }

    if (newPassword.length < 8) {
      setToast({ message: 'Password must be at least 8 characters', type: 'error' })
      return
    }

    try {
      // Simulate password change API call
      setToast({ message: 'Password changed successfully', type: 'success' })
      setShowPasswordModal(false)
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setToast({ message: 'Failed to change password', type: 'error' })
    }
  }

  const handleLogout = () => {
    // Simulate logout
    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar userName="John Doe" userRole={userRole} onLogout={handleLogout} />
        <div className="ml-60 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-dhl-red border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar userName="John Doe" userRole={userRole} onLogout={handleLogout} />
      
      <div className="ml-60 flex-1 bg-dhl-light min-h-screen">
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-black text-dhl-dark">Settings</h1>
            <p className="text-dhl-muted">Manage your profile and application preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="label-text">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="label-text">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="label-text">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employee_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                      className="input-field"
                      placeholder="Enter your employee ID"
                    />
                  </div>

                  <div>
                    <label className="label-text">Role</label>
                    <input
                      type="text"
                      value={userRole}
                      disabled
                      className="input-field bg-gray-100 text-gray-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="btn-primary w-full py-3 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Security */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security
                </h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full py-2 px-4 border border-dhl-border rounded-lg hover:bg-dhl-light transition-colors text-left flex items-center justify-between"
                  >
                    <span>Change Password</span>
                    <Eye className="w-4 h-4 text-dhl-muted" />
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-dhl-dark">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-dhl-dark">In-App Notifications</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </label>
                </div>
              </div>

              {/* Preferences */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Preferences
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="label-text">Language</label>
                    <select className="input-field">
                      <option>English</option>
                      <option>German</option>
                      <option>French</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label-text">Timezone</label>
                    <select className="input-field">
                      <option>UTC</option>
                      <option>EST</option>
                      <option>PST</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card p-6 border-l-4 border-dhl-yellow">
                <h2 className="text-xl font-bold text-dhl-dark mb-4">Actions</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full py-2 px-4 border border-dhl-border rounded-lg hover:bg-dhl-light transition-colors text-left flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <ConfirmModal
          isOpen={showPasswordModal}
          title="Change Password"
          message={
            <div className="space-y-4">
              <div>
                <label className="label-text">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-dhl-muted" /> : <Eye className="w-4 h-4 text-dhl-muted" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="label-text">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          }
          confirmText="Change Password"
          cancelText="Cancel"
          onConfirm={handlePasswordChange}
          onCancel={() => {
            setShowPasswordModal(false)
            setNewPassword('')
            setConfirmPassword('')
            setShowPassword(false)
          }}
        />
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <ConfirmModal
          isOpen={showLogoutModal}
          title="Logout"
          message="Are you sure you want to logout? You will need to sign in again to access the application."
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

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

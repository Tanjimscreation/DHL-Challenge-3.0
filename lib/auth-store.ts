'use client'

import type { User } from './types'
import { mockUsers } from './mock-data'

const AUTH_KEY = 'resolviq_auth'
const USERS_KEY = 'resolviq_users'

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return mockUsers
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers))
  return mockUsers
}

function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(AUTH_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  // Simple mock authentication - in real app, this would verify against Supabase
  const users = getStoredUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    return { success: false, error: 'No account found with this email' }
  }
  
  // For demo, password is 'password123' for all mock users
  if (password !== 'password123') {
    return { success: false, error: 'Invalid password' }
  }
  
  setCurrentUser(user)
  return { success: true, user }
}

export function signup(data: {
  name: string
  email: string
  password: string
  role: User['role']
  employeeId: string
}): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers()
  
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists' }
  }
  
  const newUser: User = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    role: data.role,
    employeeId: data.employeeId,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, user: newUser }
}

export function logout() {
  setCurrentUser(null)
}

export function updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'email' | 'employeeId'>>): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }
  
  if (data.email) {
    const emailExists = users.find(u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== userId)
    if (emailExists) {
      return { success: false, error: 'Email already in use' }
    }
  }
  
  const updatedUser = { ...users[userIndex], ...data }
  users[userIndex] = updatedUser
  saveUsers(users)
  setCurrentUser(updatedUser)
  
  return { success: true, user: updatedUser }
}

export function deleteAccount(userId: string): { success: boolean; error?: string } {
  const users = getStoredUsers()
  const filteredUsers = users.filter(u => u.id !== userId)
  saveUsers(filteredUsers)
  setCurrentUser(null)
  return { success: true }
}

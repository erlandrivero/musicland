// Global type definitions for AI Music Studio

// Re-export auth types
export * from './auth'

// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  subscription: 'free' | 'creator' | 'team'
  credits: number
  totalCredits: number
}

// Music generation types
export interface Track {
  id: string
  title: string
  artist?: string
  duration: number
  audioUrl: string
  coverUrl?: string
  genre: string
  createdAt: Date
  status: 'pending' | 'processing' | 'completed' | 'failed'
  prompt?: string
  style?: string
  isCustom: boolean
  model?: 'suno' | 'riffusion' | 'nuro'
}

export interface CreditsResponse {
  credits: number
  total_credits: number
  credits_used: number
}

// Project types
export interface Project {
  id: string
  name: string
  description?: string
  userId: string
  tracks: Track[]
  createdAt: Date
  updatedAt: Date
}

export interface Track {
  id: string
  title: string
  audioUrl: string
  duration: number
  projectId: string
  generationId: string
  createdAt: Date
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export interface CardProps {
  variant?: 'default' | 'hover' | 'bordered'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

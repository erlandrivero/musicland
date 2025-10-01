import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      credits: number
      totalCredits: number
      subscription: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    credits: number
    totalCredits: number
    subscription: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
  }
}

export interface AuthUser {
  id: string
  name: string | null
  email: string
  image: string | null
  credits: number
  totalCredits: number
  subscription: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface SignInCredentials {
  email: string
  callbackUrl?: string
}

export interface AuthError {
  type: string
  message: string
}

export type AuthProvider = "google" | "email"

export type SubscriptionTier = "free" | "creator" | "team"

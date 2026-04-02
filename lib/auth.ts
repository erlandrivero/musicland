import { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Resend({
      from: "onboarding@resend.dev",
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Set user properties from token
        if (token.email) {
          session.user.email = token.email as string
        }
        if (token.name) {
          session.user.name = token.name as string
        }
        if (token.picture) {
          session.user.image = token.picture as string
        }
        if (token.sub) {
          session.user.id = token.sub
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // Store user email as the primary identifier
        token.email = user.email
        token.name = user.name
        // Store the image URL in the token
        if (user.image) {
          token.picture = user.image
        }
      }
      // For Google OAuth, preserve the profile picture and email
      if (account?.provider === 'google' && profile) {
        token.picture = profile.picture
        token.email = profile.email
        token.name = profile.name
      }
      return token
    },
    async signIn({ user, account, profile }) {
      // For Google OAuth, ensure the image URL is preserved
      if (account?.provider === 'google' && profile?.picture) {
        user.image = profile.picture
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
} satisfies NextAuthConfig

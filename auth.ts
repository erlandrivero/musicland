import NextAuth from "next-auth"
import { authConfig } from "./lib/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true, // Required for Netlify and other hosting platforms
})

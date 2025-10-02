import NextAuth from "next-auth"
import { authConfig } from "./lib/auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
})

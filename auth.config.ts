import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || "dev_secret_change_me",
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Demo Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const name = (credentials?.name as string | undefined)?.trim()
        const role = ((credentials?.role as string | undefined) || "staff").trim()
        if (!name) return null
        return { id: crypto.randomUUID(), name, role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.name = user.name
        ;(token as any).role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session as any).id = (token as any).id
        session.user.name = token.name
        ;(session.user as any).role = (token as any).role
      }
      return session
    },
  },
} satisfies NextAuthConfig



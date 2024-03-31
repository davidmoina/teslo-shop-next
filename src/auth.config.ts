import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrytpjs from 'bcryptjs'

const privateRoutes = [
  '/admin',
  '/admin/orders',
  '/admin/users',
  '/checkout',
  '/checkout/address',
  '/profile',
  '/orders',
  '/orders/[id]',
];

const isOnPrivateRoute = (pathname: string) => {
  return privateRoutes.some((route) => {
    // Convertir rutas como '/orders/[id]' en una expresión regular
    const routeRegex = new RegExp(
      '^' + route.replace(/\[.*?\]/g, '[^/]+') + '$',
    );
    return routeRegex.test(pathname);
  });
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      if (isOnPrivateRoute(pathname)) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.data = user
      }

      return token
    },
    session({ session, token }) {
      session.user = token.data as any

      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        // Search email
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
        if (!user) return null

        // Compare passwords
        if (!bcrytpjs.compareSync(password, user.password)) return null

        // Return user data without password
        const { password: _, ...userData } = user

        return userData
      },
    }),
  ]
};

// auth is middleware
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)
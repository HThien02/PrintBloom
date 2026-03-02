import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log("User not found:", credentials.email);
          return null;
        }

        if (!user.password) {
          console.log("User has no password set");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        console.log("Login successful:", user.email); // Cast to any to access role field which exists in schema but not generated client yet
        const userWithRole = user as any;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: userWithRole.role || "USER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 1. Chỉ chạy khi đăng nhập lần đầu (SignIn)
      if (account && user) {
        // Tìm User trong DB bằng email để lấy ID chuẩn của Prisma
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role || "USER";
        } else if (account.provider === "google") {
          // Nếu là Google và chưa có trong DB (trường hợp hiếm khi signIn đã lo)
          const newUser = await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              image: user.image as string,
              provider: "google",
            },
          });
          token.id = newUser.id;
          token.role = "USER";
        }
      }

      // 2. Dự phòng cho những lần refresh session sau này
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role || "USER";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || "USER";
        session.user.id = token.id as string;
        session.user.image = (token.picture as string) || null;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow OAuth sign ins
      if (account?.provider === "google") {
        return true;
      } // Allow credentials sign in
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours
  },
  trustHost: true,
});

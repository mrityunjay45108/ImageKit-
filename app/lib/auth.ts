import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import dbConnect from "./db";
import User from "../model/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    
    // 🔹 1. Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    }),

    // 🔹 2. Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  // 🔥 IMPORTANT: callbacks
  callbacks: {
    
    async signIn({ user, account }) {
      await dbConnect();

      // 🔹 Google login case
      if (account?.provider === "google") {

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // New user → DB me save karo
          await User.create({
            email: user.email,
            name: user.name,
            password: "GOOGLE_AUTH", // dummy password
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // login ke time user milta hai
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
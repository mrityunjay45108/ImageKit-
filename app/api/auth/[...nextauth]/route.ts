
import { authOptions } from "@/app/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export {handler as GET };
export {handler as POST };
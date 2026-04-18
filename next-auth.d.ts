import { Address } from './node_modules/openid-client/types/index.d';
import NextAuth,{DefaultSession} from "next-auth";
declare module "next-auth" {
  interface Session  {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
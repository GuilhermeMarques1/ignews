import { query as q } from "faunadb";
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: { scope: 'read:user' }
      }
    }),
    // ...add more providers here 
  ],
  
  callbacks: {
    async signIn({ user }) {
      try {
        fauna.query(
          q.Create(
            q.Collection('users'),
            { 
              data: { 
                email: user.email 
              } 
            },
          )
        );

        return true;
      } catch (error) {
        return false;
      }
    }
  }
}

export default NextAuth(authOptions);

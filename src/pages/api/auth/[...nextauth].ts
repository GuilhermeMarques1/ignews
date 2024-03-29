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
    async session({ session }) {
      try {
        const activeUserSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        );

        return {
          ...session,
          activeSubscription: activeUserSubscription ,
        };
      } catch  {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },

    async signIn({ user }) {
      try {
        fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email: user.email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
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

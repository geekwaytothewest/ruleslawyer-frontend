import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import beFetch from "./utilities/beFetch";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      authorization: { params: { scope: "openid email profile", audience: process.env.AUTH0_AUDIENCE } },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && account.access_token) {
        // set access_token to the token payload
        token.accessToken = account.access_token;
      }

      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },
    session: async ({ session, token, user }) => {
      // If we want to make the accessToken available in components, then we have to explicitly forward it here.
      return { ...session, token: token.accessToken };
    },
  },
});

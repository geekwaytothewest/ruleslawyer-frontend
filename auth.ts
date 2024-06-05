import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      authorization: {
        params: {
          scope: "openid email profile offline_access",
          audience: process.env.AUTH0_AUDIENCE,
        },
      },
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
        token.expiresAt = account.expires_at;
        token.refreshToken = account.refresh_token;
      }

      if (
        token.expiresAt &&
        new Date().getMilliseconds() < (token.expiresAt as number) * 1000 &&
        token.refreshToken
      ) {
        try {
          const response = await fetch("https://geekway.auth0.com/oauth/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.AUTH0_CLIENT_ID!,
              client_secret: process.env.AUTH0_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token as string,
            }),
            method: "POST",
          })

          const responseTokens = await response.json()

          if (!response.ok) throw responseTokens

          return {
            ...token,
            accessToken: responseTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + (responseTokens.expires_in as number)),
            refreshToken: responseTokens.refresh_token ?? token.refresh_token,
          }
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property can be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const }
        }
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

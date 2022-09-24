// NextAuth
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";
import { GraphQLClient } from "graphql-request";
import { gql } from 'graphql-request';
import { hygraphClient } from '../../../lib/hygraph';

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
  },
});

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    user: nextUser(where: { email: $email }, stage: DRAFT) {
      id
      password
    }
  }
`;


export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: 'jwt',
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#0A25D9", // Hex color code
    logo: "https://media.graphassets.com/vDXj0jbVQ1K8lnyS7cjO", // Absolute URL to image
    buttonText: "#0A25D9" // Hex color code
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jamie@graphcms.com"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password"
        },
      },
      authorize: async ({ email, password }) => {
        const { user } = await client.request(GetUserByEmail, {
          email,
        });

        const isValid = await compare(password, user.password);

        if (!isValid) {
          throw new Error("Wrong credentials. Try again.");
        }

        return {
          id: user.id,
          username: email,
          email,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return '/dashboard'
    },
    async session({ session, token }) {
      session.userId = token.sub;
      return Promise.resolve(session);
    },
  },
})

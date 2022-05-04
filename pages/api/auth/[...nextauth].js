// NextAuth
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";

// GraphCMS
import { gql } from 'graphql-request';
import { graphcmsClient } from '../../../lib/graphcms';

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    user: nextUser(where: { email: $email }, stage: DRAFT) {
      id
      password
    }
  }
`;

const CreateNextUserByEmail = gql`
  mutation CreateNextUserByEmail($email: String!, $password: String!) {
    newUser: createNextUser(data: { email: $email, password: $password }) {
      id
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
        const { user } = await graphcmsClient.request(GetUserByEmail, {
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
      return `${baseUrl}/account`
    },
    async session({ session, token }) {
      session.userId = token.sub;
      return Promise.resolve(session);
    },
  },
})

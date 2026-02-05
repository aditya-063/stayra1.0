import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@/lib/auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const email = user.email!;
                    const googleId = account.providerAccountId;

                    // Check if user exists
                    let existingUser = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: email },
                                { googleId: googleId }
                            ]
                        }
                    });

                    if (existingUser) {
                        // Link Google account if not already linked
                        if (!existingUser.googleId) {
                            await prisma.user.update({
                                where: { id: existingUser.id },
                                data: {
                                    googleId: googleId,
                                    isEmailVerified: true,
                                    profilePicture: user.image || existingUser.profilePicture,
                                    name: user.name || existingUser.name,
                                }
                            });
                        }
                    } else {
                        // Create new user
                        existingUser = await prisma.user.create({
                            data: {
                                email: email,
                                googleId: googleId,
                                name: user.name || null,
                                profilePicture: user.image || null,
                                isEmailVerified: true,
                                // password is optional for OAuth users
                            }
                        });
                    }

                    // Update last login
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { lastLoginAt: new Date() }
                    });

                    return true;
                } catch (error) {
                    console.error("Error in Google sign-in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "google" && user?.email) {
                // Fetch the full user from database
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email }
                });

                if (dbUser) {
                    // Generate our custom JWT token
                    const customToken = generateToken(dbUser.id);

                    token.customToken = customToken;
                    token.userId = dbUser.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.userId) {
                session.user = {
                    ...session.user,
                    id: token.userId as string,
                    customToken: token.customToken as string,
                };
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

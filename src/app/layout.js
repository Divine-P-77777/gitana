import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gitana — AI GitHub Project Mentor",
  description: "AI-powered GitHub repository analysis and mentorship",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
        >
          {/* Minimal Auth Bar (Optional but clean) */}
          <div className="flex justify-end p-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="mr-3 text-sm px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

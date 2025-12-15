import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
  description: "Get mentor-style feedback on any public GitHub repository. Analyze structure, code quality, and documentation with AI.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Gitana — AI GitHub Project Mentor",
    description: "Get mentor-style feedback on any public GitHub repository. Analyze structure, code quality, and documentation with AI.",
    url: "https://git-ana.vercel.app",
    siteName: "Gitana",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Gitana Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitana — AI GitHub Project Mentor",
    description: "Get mentor-style feedback on any public GitHub repository. Analyze structure, code quality, and documentation with AI.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white min-h-screen flex flex-col`}
        >
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

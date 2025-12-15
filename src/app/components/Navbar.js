"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <nav className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}

                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    {/* <div className="relative w-8 h-8 bg-white rounded-full overflow-hidden"> */}
                    <img
                        src="/logo.png"
                        alt="Gitana Logo"
                        // fill
                        className="object-contain w-12 p-0.5"
                    />
                    {/* </div> */}
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
                        Gitana
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                    <Link href="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        GitHub
                    </a>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-neutral-200 transition-colors">
                                Get Started
                            </button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 ring-2 ring-neutral-800"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}

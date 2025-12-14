import Link from "next/link";

export default function Home() {
    return (
        <div className="relative isolate pt-14 dark:bg-neutral-950 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">

            {/* Background Gradients */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-2xl text-center px-6">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-neutral-400 ring-1 ring-white/10 hover:ring-white/20">
                        Powered by advanced AI analysis.{" "}
                        <Link href="/dashboard" className="font-semibold text-white">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Try it out <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    Elevate Your Code with <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Gitana</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-neutral-300">
                    Get instant, mentor-style feedback on your GitHub repositories.
                    Analyze structure, code quality, and documentation to build better software.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/dashboard"
                        className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
                    >
                        Analyze Repository
                    </Link>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-white hover:text-neutral-300 transition-colors">
                        Learn more <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>

            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
        </div>
    );
}

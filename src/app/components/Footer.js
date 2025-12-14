export default function Footer() {
    return (
        <footer className="border-t border-neutral-800 bg-neutral-950 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
                <div className="mb-4 md:mb-0">
                    <p>&copy; {new Date().getFullYear()} Gitana. All rights reserved.</p>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
                    <a href="https://github.com/Divine-P-77777/gitana" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}

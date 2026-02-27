import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center px-8 py-4 border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <Link href="/" className="text-xl font-black tracking-tighter text-main-text">
                TripWise<span className="text-blue-500">.</span>
            </Link>
            <ThemeSwitcher />
        </header>
    );
}
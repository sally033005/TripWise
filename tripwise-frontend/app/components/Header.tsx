"use client";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function Header() {
    const [username, setUsername] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const storedName = localStorage.getItem("username");
            if (storedName) {
                setUsername(storedName);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setUsername(null);
            }
        };

        setMounted(true);
        checkAuth();

        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        setIsLoggedIn(false);
        setUsername(null);
        router.push("/login");
    };

    if (!mounted) {
        return (
            <header className="flex justify-between items-center px-8 py-4 border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                <Link href="/" className="text-2xl italic tracking-tighter font-black text-main-text">
                    TripWise<span className="text-blue-500">.</span>
                </Link>
                <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full"></div>
            </header>
        );
    }

    return (
        <header className="flex justify-between items-center px-8 py-4 border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <Link href="/" className="text-2xl italic tracking-tighter font-black text-main-text">
                TripWise<span className="text-blue-500">.</span>
            </Link>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1.5 pl-4 rounded-full border border-slate-100 dark:border-slate-700">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                            {username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white dark:bg-slate-900 text-xs font-black uppercase tracking-widest text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-all active:scale-95 border border-red-100"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-md hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Sign In
                    </Link>
                )}

                <ThemeSwitcher />
            </div>
        </header>
    );
}
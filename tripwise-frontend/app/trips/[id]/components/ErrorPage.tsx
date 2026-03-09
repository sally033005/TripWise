"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
    status?: number;
    message?: string;
    subtitle?: string;
}

export default function ErrorPage({
    status = 404,
    message = "Something went wrong",
    subtitle = "We couldn't find the page you're looking for."
}: ErrorPageProps) {
    const router = useRouter();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md w-full">
                <div className="relative mb-8">
                    <div className="text-9xl font-black text-slate-100 dark:text-slate-800 absolute inset-0 flex items-center justify-center -z-10 select-none">
                        {status}
                    </div>
                    <div className="text-6xl">🔍</div>
                </div>

                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                    {message}
                </h1>

                <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed">
                    {subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700"
                    >
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl text-xs uppercase tracking-widest"
                    >
                        Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}
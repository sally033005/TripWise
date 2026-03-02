"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Link from "next/link"; // Add this import for Link component

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login({ username, password });
      
      router.push("/");
      router.refresh(); 
    } catch (err) {
      alert("Login failed! Please check your username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">TripWise</h1>
          <p className="text-slate-400 font-medium mt-2">Welcome back, traveler!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username"
            required
            className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            required
            className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={isLoading}
            className={`w-full py-5 ${isLoading ? 'bg-slate-400' : 'bg-slate-900 dark:bg-blue-600'} text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all active:scale-95 mt-4`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          New here?{" "}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
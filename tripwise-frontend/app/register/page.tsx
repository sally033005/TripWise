"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data || "Registration failed. Try another username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">TripWise</h1>
          <p className="text-slate-400 font-medium mt-2">Start your journey with us.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username"
            required
            className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email Address"
            required
            className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Create Password"
            required
            className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <button 
            disabled={loading}
            className={`w-full py-5 ${loading ? 'bg-slate-400' : 'bg-slate-900 dark:bg-blue-600'} text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all active:scale-95 mt-4`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    alert("🎉 Login Successful! Welcome back.");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#8da399] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="bg-[#1a3c3c] p-8 text-center relative">
            <Link href="/" className="absolute top-6 left-6 text-white/70 hover:text-white">
                <ArrowLeft />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-teal-100/80 text-sm">Sign in to continue your progress</p>
        </div>

        <div className="p-8 space-y-6">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            <button 
                onClick={handleLogin}
                className="w-full bg-[#1a3c3c] text-white font-bold py-3 rounded-xl hover:bg-[#142e2e] transition shadow-lg transform active:scale-95"
            >
                Log In
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
                Don't have an account? 
                <Link href="/signup" className="text-teal-600 font-bold hover:underline ml-1">
                    Sign Up
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!fullName || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    const userData = { name: fullName, email: email };
    localStorage.setItem("worddee_user", JSON.stringify(userData));

    alert("Account created successfully! Please log in.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#8da399] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="bg-[#1a3c3c] p-8 text-center relative">
            <Link href="/" className="absolute top-6 left-6 text-white/70 hover:text-white">
                <ArrowLeft />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Create Account</h1>
            <p className="text-teal-100/80 text-sm">Join Worddee and start learning</p>
        </div>

        <div className="p-8 space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                <input 
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            <button 
                onClick={handleSignup}
                className="w-full bg-[#1a3c3c] text-white font-bold py-3 rounded-xl hover:bg-[#142e2e] transition shadow-lg mt-2 transform active:scale-95"
            >
                Sign Up
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
                Already have an account? 
                <Link href="/login" className="text-teal-600 font-bold hover:underline ml-1">
                    Log In
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
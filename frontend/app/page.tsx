"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, UserCircle, LogIn } from "lucide-react"; 

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("worddee_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col relative overflow-hidden">
      
      <div className="absolute top-6 right-8 z-50">
        {user ? (
          <Link href="/profile" className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group animate-in fade-in slide-in-from-top-2">
             <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserCircle className="w-full h-full text-gray-400 p-1" />
                )}
             </div>
             <span className="font-bold text-gray-700 text-sm group-hover:text-teal-700 transition max-w-[150px] truncate">
                {user.name}
             </span>
          </Link>
        ) : (
          <Link href="/login" className="flex items-center gap-2 bg-white px-6 py-2 rounded-full font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition">
             <LogIn size={18} />
             Log In
          </Link>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10 mt-10 animate-in fade-in zoom-in duration-500">
         <h1 className="text-6xl font-serif font-bold text-[#1a3c3c] mb-4 tracking-tight">Worddee.ai</h1>
         <p className="text-xl text-slate-600 mb-2 font-medium">ฝึกแต่งประโยคภาษาอังกฤษด้วย AI</p>
         <p className="text-gray-400 mb-10">เรียนรู้วันละคำ เก่งขึ้นทุกวัน</p>

         <div className="flex gap-4">
             <Link href="/word-of-the-day">
                <button className="bg-[#1a3c3c] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#142e2e] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Start Challenge <ArrowRight size={18} />
                </button>
             </Link>
             
             <Link href="/dashboard">
                <button className="bg-white text-[#1a3c3c] px-8 py-3 rounded-full font-bold border border-[#1a3c3c] flex items-center gap-2 hover:bg-gray-50 transition shadow-md">
                    View Dashboard <LayoutDashboard size={18} />
                </button>
             </Link>
         </div>
      </div>
      
      <div className="text-center text-gray-400 text-xs pb-6">
        © 2025 Worddee.ai - English Learning Platform
      </div>
    </div>
  );
}
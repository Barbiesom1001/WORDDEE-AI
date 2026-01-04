import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react"; // เรียกใช้ไอคอนสวยๆ

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf2f8] flex flex-col relative">

      <nav className="absolute top-0 w-full p-6 flex justify-end">
        <Link href="/login">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#1a3c3c] font-bold rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition border border-gray-100">
                <LogIn size={18} />
                Log In
            </button>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-500">
        
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#1a3c3c] mb-6 drop-shadow-sm">
            Worddee.ai
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-12 font-medium max-w-lg leading-relaxed">
            ฝึกแต่งประโยคภาษาอังกฤษด้วย AI <br/> 
            <span className="text-base text-slate-500 font-normal">เรียนรู้วันละคำ เก่งขึ้นทุกวัน</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <Link href="/word-of-the-day">
            <button className="px-8 py-4 bg-[#1a3c3c] text-white rounded-full font-bold text-lg hover:bg-[#142e2e] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto">
              Start Challenge
              <ArrowRight size={20} />
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="px-8 py-4 bg-white text-[#1a3c3c] border-2 border-[#1a3c3c] rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3 w-full sm:w-auto">
              View Dashboard 
            </button>
          </Link>
        </div>

      </main>
      
      <footer className="p-6 text-center text-gray-400 text-sm">
        © 2025 Worddee.ai - English Learning Platform
      </footer>
    </div>
  );
}
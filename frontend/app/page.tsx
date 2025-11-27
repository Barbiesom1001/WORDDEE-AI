import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf4ff] flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-serif font-bold text-[#1a3c3c] mb-4">Worddee.ai</h1>
      <p className="text-gray-600 mb-10 text-lg">ฝึกแต่งประโยคภาษาอังกฤษด้วย AI</p>

      <div className="flex gap-6">
        {}
        <Link href="/word-of-the-day">
          <button className="px-8 py-4 bg-[#1a3c3c] text-white rounded-full text-xl font-bold hover:bg-[#142e2e] transition shadow-lg">
            Start Challenge 🎯
          </button>
        </Link>

        {}
        <Link href="/dashboard">
          <button className="px-8 py-4 bg-white text-[#1a3c3c] border-2 border-[#1a3c3c] rounded-full text-xl font-bold hover:bg-gray-50 transition shadow-lg">
            View Dashboard 📊
          </button>
        </Link>
      </div>
    </div>
  );
}
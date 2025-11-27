"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, Flame, Clock } from "lucide-react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// กำหนดหน้าตาข้อมูลกราฟ
interface ChartData {
    date: string;
    score: number;
}

export default function Dashboard() {
  const [data, setData] = useState<ChartData[]>([]);
  // 1. เพิ่มตัวแปรเช็คว่าโหลดหน้าเว็บเสร็จหรือยัง
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 2. บอกว่า "ตอนนี้อยู่หน้าเว็บแล้วนะ"
    setIsClient(true);

    // ดึงข้อมูลจาก Backend
    axios.get("http://localhost:8000/api/summary")
      .then((res) => setData(res.data))
      .catch((err) => {
          console.error("Error fetching summary:", err);
          setData([
              { date: "Mon", score: 5.5 },
              { date: "Tue", score: 7.0 },
              { date: "Wed", score: 6.5 },
              { date: "Thu", score: 8.0 },
              { date: "Fri", score: 9.5 },
          ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf2f8]">
      {/* Navbar */}
      <nav className="bg-white py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="text-xl font-bold font-serif tracking-tight text-[#1a3c3c]">worddee.ai</div>
        <div className="space-x-6 text-sm text-gray-500 font-medium">
          <span className="text-teal-600 border-b-2 border-teal-600 pb-1 cursor-default">My Progress</span>
          <Link href="/word-of-the-day" className="hover:text-teal-700 transition">Word of the Day</Link>
        </div>
        <UserCircle className="text-teal-600 w-8 h-8" />
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-6">User's learner dashboard</h1>

        {/* Missions Banner */}
        <div className="mb-10">
            <h2 className="text-xl font-serif font-bold text-[#1a3c3c] mb-4">Your missions today</h2>
            <div className="bg-[#eff6f5] p-4 rounded-lg text-[#2f5f5f] font-medium text-sm flex items-center border border-[#dcece9]">
                🎉 Well done! You've completed all your missions.
            </div>
        </div>

        {/* Overview Section */}
        <h2 className="text-xl font-serif font-bold text-[#1a3c3c] mb-4">Overview</h2>
        
        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-serif font-bold text-[#2f5f5f] mb-8">Learning consistency</h3>
            <div className="flex justify-around items-center">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="text-green-400 w-8 h-8 fill-green-400" />
                        <span className="text-4xl font-bold text-[#1a3c3c]">1</span>
                    </div>
                    <p className="text-gray-500 text-sm">Day streak</p>
                </div>
                <div className="h-16 w-px bg-gray-200"></div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="text-blue-400 w-8 h-8" />
                        <span className="text-4xl font-bold text-[#1a3c3c]">10</span>
                    </div>
                    <p className="text-gray-500 text-sm">Minutes learned</p>
                </div>
            </div>
        </div>

        {/* 📊 Chart Area */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[450px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 cursor-pointer text-[#1a3c3c] font-bold font-serif text-lg">
                    Writing Scores Progress
                </div>
                <span className="text-teal-600 text-xs font-medium bg-teal-50 px-3 py-1 rounded-full">Weekly View</span>
            </div>
            
            {/* 3. แก้ไขส่วนแสดงกราฟ: ต้องมี isClient เป็นจริงก่อนถึงจะวาดกราฟ */}
            <div className="w-full h-[300px]"> {/* กำหนดความสูงที่แน่นอนตรงนี้ (h-[300px]) */}
                {isClient ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1a3c3c" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#1a3c3c" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 12}} 
                                dy={10}
                            />
                            <YAxis 
                                domain={[0, 10]} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 12}}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                                }}
                                itemStyle={{ color: '#1a3c3c', fontWeight: 'bold' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#1a3c3c" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorScore)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#1a3c3c' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Loading graph...</div>
                )}
            </div>

            <div className="flex justify-center mt-6">
                <Link href="/word-of-the-day">
                    <button className="bg-[#1a3c3c] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-[#142e2e] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Practice More Words
                    </button>
                </Link>
            </div>
        </div>

      </main>
    </div>
  );
}
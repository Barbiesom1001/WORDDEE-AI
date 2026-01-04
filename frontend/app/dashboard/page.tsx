"use client";

import { useState, useEffect } from "react";
import { UserCircle, Flame, Clock } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [stats, setStats] = useState({ streak: 0, minutes: 0 });
  
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    generateRealData();
    calculateStats();
  }, []);
  
  const calculateStats = () => {
    const savedHistory = localStorage.getItem("worddee_game_history");
    if (savedHistory) {
        const history = JSON.parse(savedHistory);
        
        const totalPlayed = history.length;

        const totalMinutes = totalPlayed * 3;

        setStats({ 
            streak: totalPlayed, 
            minutes: totalMinutes 
        });
    }
  };

  const generateRealData = () => {
    const savedHistory = localStorage.getItem("worddee_game_history");
    const history: any[] = savedHistory ? JSON.parse(savedHistory) : [];

    const newData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        
        const dateKey = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); 
        const dateNum = d.getDate().toString().padStart(2, '0');
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        const year = d.getFullYear();

        const recordsToday = history.filter((h: any) => h.date === dateKey);

        if (recordsToday.length > 0) {
            recordsToday.forEach((record: any) => {
                const timeLabel = record.time ? ` (${record.time})` : "";
                newData.push({
                    name: `${dayName} ${dateNum} ${monthName} ${year}${timeLabel}`,
                    score: record.score
                });
            });
        } else {
            newData.push({
                name: `${dayName} ${dateNum} ${monthName} ${year}`, 
                score: 0
            });
        }
    }
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-[#fdf2f8]" suppressHydrationWarning>
      
      <nav className="bg-white py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold font-serif tracking-tight text-[#1a3c3c] cursor-pointer hover:opacity-80 transition">
            worddee.ai
        </Link>
        <div className="space-x-6 text-sm text-gray-500 font-medium">
          <span className="text-teal-600 border-b-2 border-teal-600 pb-1 cursor-default">My Progress</span>
          <Link href="/word-of-the-day" className="hover:text-teal-700 transition">Word of the Day</Link>
        </div>
        
        <div className="relative">
            <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-1 rounded-full hover:bg-gray-100 transition focus:outline-none"
            >
                <UserCircle className="text-teal-600 w-8 h-8" />
            </button>

            {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2 bg-gray-50">
                        <p className="text-sm font-bold text-gray-800">Guest User</p>
                        <p className="text-xs text-gray-500">Welcome to Worddee!</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">👤 My Profile</Link>
                    <Link href="/word-of-the-day" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">📝 Word of the Day</Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link href="/login" className="block px-4 py-2 text-sm text-teal-600 font-semibold hover:bg-teal-50 transition-colors">🔐 Log In / Sign Up</Link>
                </div>
            )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-6">User's learner dashboard</h1>

        <div className="mb-10">
            <h2 className="text-xl font-serif font-bold text-[#1a3c3c] mb-4">Your missions today</h2>
            <div className="bg-[#eff6f5] p-4 rounded-lg text-[#2f5f5f] font-medium text-sm flex items-center border border-[#dcece9]">
                Keep learning to increase your stats!
            </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-serif font-bold text-[#2f5f5f] mb-8">Learning consistency</h3>
            <div className="flex justify-around items-center">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="text-green-400 w-8 h-8 fill-green-400" />
                        <span className="text-4xl font-bold text-[#1a3c3c]">{stats.streak}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Total Played</p>
                </div>
                <div className="h-16 w-px bg-gray-200"></div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="text-blue-400 w-8 h-8" />
                        <span className="text-4xl font-bold text-[#1a3c3c]">{stats.minutes}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Minutes learned</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[450px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 cursor-pointer text-[#1a3c3c] font-bold font-serif text-lg">
                    Writing Scores Progress
                </div>
            </div>
            
            <div className="w-full h-[300px]">
                {isClient && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1a3c3c" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#1a3c3c" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={5} />
                            
                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="score" stroke="#1a3c3c" strokeWidth={3} fill="url(#colorScore)" activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Loading graph...</div>
                )}
            </div>

            <div className="flex justify-center mt-6">
                <Link href="/word-of-the-day">
                    <button className="bg-[#1a3c3c] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-[#142e2e] transition shadow-lg transform hover:-translate-y-0.5">
                        Practice More Words
                    </button>
                </Link>
            </div>
        </div>

      </main>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Play, UserCircle, RefreshCcw, Clock } from "lucide-react"; 
import Link from "next/link";

interface WordData {
  word: string;
  type: string;
  pronunciation: string;
  meaning: string;
  example: string;
  imageUrl: string;
}

interface Feedback {
  score: number;
  level: string;
  suggestion: string;
  corrected_sentence: string;
  time: string;
}

export default function WordOfTheDay() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sentence, setSentence] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchWord();

    const savedUser = localStorage.getItem("worddee_user");
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user.name) setUserName(user.name);
        } catch (e) {
            console.error("Error parsing user data", e);
        }
    }
  }, []);

  const fetchWord = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/word");
      const dataWithFallback = {
        ...res.data,
        imageUrl: (res.data.imageUrl && res.data.imageUrl.startsWith("http")) 
          ? res.data.imageUrl 
          : "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop"
      };
      setWordData(dataWithFallback);
      
      setIsSubmitted(false);
      setSentence("");
      setFeedback(null);
    } catch (error) {
      console.error("Error fetching word:", error);
      setWordData({
          word: "Serendipity",
          type: "Noun",
          pronunciation: "/ˌser.ənˈdɪp.ə.t̬i/",
          meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
          example: "Finding my favorite book in the clearance bin was pure serendipity.",
          imageUrl: "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sentence.trim()) return;
    setIsChecking(true);

    setTimeout(() => {
        const fakeScore = Math.floor(Math.random() * 6) + 5; // สุ่ม 5-10
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const fakeFeedback: Feedback = {
            score: fakeScore,
            level: fakeScore > 8 ? "Advanced" : "Intermediate",
            suggestion: "Good effort! Try to add more descriptive adjectives next time.",
            corrected_sentence: sentence + " (Enhanced version)",
            time: timeString
        };
        setFeedback(fakeFeedback);

        const today = new Date().toISOString().split('T')[0];
        const newRecord = { 
            date: today, 
            score: fakeScore,
            time: timeString
        };

        const savedHistory = localStorage.getItem("worddee_game_history");
        let history = savedHistory ? JSON.parse(savedHistory) : [];
        history.push(newRecord);
        localStorage.setItem("worddee_game_history", JSON.stringify(history));

        setIsChecking(false);
        setIsSubmitted(true);
    }, 1500); 
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser does not support TTS");
    }
  };

  if (!mounted) return null;

  if (loading || !wordData) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#8da399]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <div className="text-xl font-serif text-white">Loading new word...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#8da399] flex flex-col"> 
      
      <nav className="bg-white py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold font-serif tracking-tight cursor-pointer hover:text-teal-800 transition">
            worddee.ai
        </Link>
        <div className="space-x-6 text-sm text-gray-500 font-medium">
          <Link href="/dashboard" className="hover:text-teal-700">My Progress</Link>
          <span className="text-teal-600">Word of the Day</span>
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
                        <p className="text-sm font-bold text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500">Welcome to Worddee!</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">👤 My Profile</Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">📊 Dashboard</Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link href="/login" className="block px-4 py-2 text-sm text-teal-600 font-semibold hover:bg-teal-50 transition-colors">🔐 Log In / Sign Up</Link>
                </div>
            )}
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        
        {!isSubmitted ? (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full flex flex-col md:flex-row min-h-[500px]">
            <div className="p-8 flex items-center justify-center md:border-r md:border-gray-100">
                <div className="w-full md:w-60 md:h-60 shrink-0 bg-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm relative group">
                    <img
                        src={wordData.imageUrl} 
                        alt={wordData.word}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop"; }}
                    />
                     <button onClick={fetchWord} className="absolute top-3 left-3 bg-white/90 p-2 rounded-full hover:bg-white transition shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer" title="Get new word">
                        <RefreshCcw size={18} className="text-gray-700"/>
                    </button>
                </div>
            </div>

            <div className="md:flex-1 p-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-1">Word of the day</h2>
                        <p className="text-gray-400 text-sm">Practice writing a meaningful sentence using today's word.</p>
                    </div>
                    <span className="bg-[#fde68a] text-[#854d0e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Level Beginner</span>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 mt-6 mb-6 relative bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => handleSpeak(wordData.word)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer">
                            <Play size={14} fill="currentColor" />
                        </button>
                        <h1 className="text-4xl font-serif font-bold text-[#1a3c3c]">{wordData.word}</h1>
                    </div>
                    <p className="text-gray-500 text-sm italic mb-2">{wordData.type} <span className="text-gray-400">{wordData.pronunciation}</span></p>
                    <p className="text-gray-700 font-medium mb-2"><span className="font-bold">Meaning:</span> {wordData.meaning}</p>
                    <p className="text-gray-500 text-sm">"{wordData.example}"</p>
                </div>

                <textarea 
                    className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={3}
                    placeholder={`Write a sentence using "${wordData.word}"...`}
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    disabled={isChecking}
                />
              </div>

              <div className="flex justify-between items-center mt-6">
                <Link href="/dashboard">
                    <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition">Do it later</button>
                </Link>
                <button 
                    onClick={handleSubmit}
                    disabled={isChecking}
                    className="px-8 py-2 bg-[#1a3c3c] text-white rounded-full font-medium hover:bg-[#142e2e] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isChecking ? "Checking..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-12 text-center relative animate-in fade-in zoom-in duration-300">
             <h2 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-2">Challenge completed</h2>
             
             {feedback?.time && (
                 <div className="flex items-center justify-center gap-1 text-gray-400 text-sm mb-6">
                     <Clock size={14} />
                     <span>Completed at {feedback.time}</span>
                 </div>
             )}
             
             {feedback && (
                <>
                 <div className="flex justify-center gap-4 mb-8">
                    <span className="bg-[#fde68a] text-[#854d0e] px-4 py-1 rounded-full text-sm font-bold">Level {feedback.level}</span>
                    <span className="bg-[#f3f0ff] text-[#6b21a8] px-4 py-1 rounded-full text-sm font-bold">Score {feedback.score}</span>
                 </div>

                 <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                    <p className="text-gray-500 text-sm">Your sentence: <span className="text-gray-800 underline decoration-gray-400">{sentence}</span></p>
                 </div>

                 <div className="text-left bg-[#e6fffa] p-6 rounded-lg border border-[#b2f5ea] mb-8">
                    <p className="text-[#2c7a7b] text-sm mb-2 font-bold">Suggestion: <span className="font-normal text-[#285e61] underline">{feedback.corrected_sentence}</span></p>
                    <p className="text-[#285e61] text-xs italic leading-relaxed">
                        {feedback.suggestion}
                    </p>
                 </div>
                </>
             )}

             <div className="flex justify-between items-center">
                <button 
                    onClick={fetchWord}
                    className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-bold hover:bg-gray-50"
                >
                    Next Word
                </button>
                <Link href="/dashboard">
                    <button className="px-8 py-3 bg-[#1a3c3c] text-white rounded-full font-bold hover:bg-[#142e2e] transition">
                        View my progress
                    </button>
                </Link>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
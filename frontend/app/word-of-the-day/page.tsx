"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Play, UserCircle, RefreshCcw } from "lucide-react"; 
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
}

export default function WordOfTheDay() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [sentence, setSentence] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWord();
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sentence || !wordData) return;
    
    try {
        const res = await axios.post("http://localhost:8000/api/validate-sentence", {
            word: wordData.word,
            sentence: sentence
        });
        setFeedback(res.data);
        setIsSubmitted(true);
    } catch (error) {
        console.error(error);
    }
  };

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
      {}
      <nav className="bg-white py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="text-xl font-bold font-serif tracking-tight">worddee.ai</div>
        <div className="space-x-6 text-sm text-gray-500 font-medium">
          <Link href="/dashboard" className="hover:text-teal-700">My Progress</Link>
          <span className="text-teal-600">Word of the Day</span>
        </div>
        <UserCircle className="text-teal-600 w-8 h-8" />
      </nav>

      {}
      <div className="flex-1 flex items-center justify-center p-4">
        
        {!isSubmitted ? (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full flex flex-col md:flex-row min-h-[500px]">
            
            {}
            <div className="p-8 flex items-center justify-center md:border-r md:border-gray-100">
                <div className="w-full md:w-60 md:h-60 shrink-0 bg-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm relative group">
                    <img
                        src={wordData.imageUrl} 
                        alt={wordData.word}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop";
                        }}
                    />
                     {}
                     <button 
                        onClick={fetchWord}
                        className="absolute top-3 left-3 bg-white/90 p-2 rounded-full hover:bg-white transition shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Get new word"
                    >
                        <RefreshCcw size={18} className="text-gray-700"/>
                    </button>
                </div>
            </div>

            {}
            <div className="md:flex-1 p-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-1">Word of the day</h2>
                        <p className="text-gray-400 text-sm">Practice writing a meaningful sentence using today's word.</p>
                    </div>
                    <span className="bg-[#fde68a] text-[#854d0e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Level Beginner</span>
                </div>

                {}
                <div className="border border-gray-200 rounded-xl p-6 mt-6 mb-6 relative bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
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
                />
              </div>

              <div className="flex justify-between items-center mt-6">
                <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 font-medium hover:bg-gray-50">Do it later</button>
                <button 
                    onClick={handleSubmit}
                    className="px-8 py-2 bg-[#1a3c3c] text-white rounded-full font-medium hover:bg-[#142e2e] transition shadow-md"
                >
                    Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-12 text-center relative">
             <h2 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-6">Challenge completed</h2>
             
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
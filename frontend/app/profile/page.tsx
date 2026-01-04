"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserCircle, Mail, BarChart3, LogOut, ArrowLeft, Save, Edit2, Camera, Image as ImageIcon } from "lucide-react"; // 🔥 เพิ่มไอคอน Image
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  
  const fileInputRef = useRef<HTMLInputElement>(null);    
  const coverInputRef = useRef<HTMLInputElement>(null); 

  const [user, setUser] = useState({ 
    name: "Guest User", 
    email: "guest@worddee.ai",
    avatarUrl: null as string | null,
    coverUrl: null as string | null
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("worddee_user");
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("File too large (>2MB)");
      const reader = new FileReader();
      reader.onloadend = () => setUser(prev => ({ ...prev, avatarUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("File too large (>2MB)");
      const reader = new FileReader();
      reader.onloadend = () => setUser(prev => ({ ...prev, coverUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("worddee_user", JSON.stringify(user));
    setIsEditing(false);
    alert("✅ Profile updated successfully!");
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#fdf2f8]">
      
      <nav className="bg-white py-4 px-8 flex items-center shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-500 hover:text-teal-700 mr-4">
            <ArrowLeft />
        </Link>
        <div className="text-xl font-bold font-serif tracking-tight text-[#1a3c3c]">My Profile</div>
      </nav>

      <main className="max-w-2xl mx-auto mt-10 p-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <div 
                className="h-44 bg-cover bg-center relative group"
                style={{
                    backgroundImage: `url('${user.coverUrl || "https://images.unsplash.com/photo-1464822759023-d625a6fc654b?q=80&w=2070&auto=format&fit=crop"}')`
                }}
            >
                <div className="absolute inset-0 bg-black/20"></div> {/* เลเยอร์เงาบางๆ */}

                {isEditing && (
                    <button 
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition"
                    >
                        <ImageIcon size={14} /> Change Cover
                    </button>
                )}

                <input 
                    type="file" 
                    ref={coverInputRef} 
                    onChange={handleCoverChange} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>


            <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                    
                    <div className="relative group">
                        <div 
                            className={`w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center shadow-md ${isEditing ? 'cursor-pointer' : ''}`}
                            onClick={() => isEditing && fileInputRef.current?.click()}
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-full h-full text-gray-300 p-1" />
                            )}
                        </div>
                        
                        {isEditing && (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-teal-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-teal-700 transition"
                            >
                                <Camera size={14} />
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    </div>
                    
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                            isEditing 
                            ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {isEditing ? <><Save size={16}/> Save Changes</> : <><Edit2 size={16}/> Edit Profile</>}
                    </button>
                </div>

                {isEditing ? (
                    <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                            <input 
                                type="text" 
                                value={user.name}
                                onChange={(e) => setUser({...user, name: e.target.value})}
                                className="w-full text-3xl font-bold text-gray-900 border-b-2 border-teal-500 focus:outline-none bg-transparent py-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                            <input 
                                type="email" 
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                className="w-full text-gray-600 border-b-2 border-teal-500 focus:outline-none bg-transparent py-1"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <div className="flex items-center text-gray-500 mt-1 mb-6">
                            <Mail size={16} className="mr-2" />
                            {user.email}
                        </div>
                    </>
                )}

                <div className="grid gap-4">
                    <Link href="/dashboard" className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-teal-50 transition group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Learning Statistics</h3>
                                <p className="text-xs text-gray-500">View your streaks and scores</p>
                            </div>
                        </div>
                        <span className="text-gray-300 group-hover:text-teal-600">→</span>
                    </Link>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-4 mt-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition w-full"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
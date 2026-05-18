"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock Users
    const users = [
      { user: "admin", pass: "123", role: "Tizim Boshqaruvchisi" },
      { user: "user", pass: "123", role: "Foydalanuvchi" },
      { user: "mehmon", pass: "123", role: "Kuzatuvchi" }
    ];

    const validUser = users.find(u => u.user === username && u.pass === password);

    if (validUser) {
      toast.success(`Xush kelibsiz, ${validUser.role}!`);
      // Save role to localStorage to show correct name in Sidebar if needed (mock)
      localStorage.setItem("userRole", validUser.role);
      router.push("/dashboard");
    } else {
      toast.error("Login yoki parol noto'g'ri!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] border border-primary/30 shadow-lg shadow-primary/20 mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Safe Mahalla</h1>
          <p className="text-foreground/60 text-sm">Yagona elektron nazorat tizimi</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-card-border/50 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Login</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="foydalanuvchi" 
                    className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 pl-11 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Parol</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 pl-11 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-card-border bg-background text-primary focus:ring-primary focus:ring-offset-0" />
                <span className="text-foreground/70 group-hover:text-foreground transition-colors">Eslab qolish</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">Parolni unutdingizmi?</a>
            </div>

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2">
              <KeyRound className="w-4 h-4" />
              Tizimga kirish
            </button>
            
            <div className="pt-4 border-t border-card-border/50">
               <button type="button" className="w-full py-3 bg-background hover:bg-card border border-card-border/80 text-foreground rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 text-safe">
                 <ShieldCheck className="w-4 h-4" />
                 E-IMZO orqali kirish
               </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-[10px] text-foreground/40 mt-8 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} O'ZBEKISTON RESPUBLIKASI YOSHLAR ISHLARI AGENTLIGI
        </p>
      </div>
    </div>
  );
}

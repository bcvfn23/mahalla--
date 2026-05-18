"use client";

import { useI18n } from "@/lib/i18n";
import { BrainCircuit, Send, Sparkles, FileText, BarChart2, ShieldAlert, CheckCircle, ChevronDown, Trophy, TrendingUp, AlertTriangle } from "lucide-react";

export default function AITahlilPage() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
            GEMINI 2.0 FLASH - REAL VAQT TAHLIL
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            AI Tahlil Markazi
          </h1>
          <p className="text-xs text-foreground/50">
            Google Gemini asosida professional yoshlar monitoring tahlili, bashorat va strategik tavsiyalar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wide) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
          
          {/* Chat Interface */}
          <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col border border-card-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">GEMINI AI YORDAMCHI</h3>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="w-3 h-3 text-white" />
                  </span>
                  Aziz AI Assistent
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-card-border bg-card hover:bg-card/80 text-xs font-medium text-foreground/70 transition-colors">
                  Tozalash
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-colors">
                  Tizim Tahlili
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px] mb-4">
              <div className="bg-[#131a2d]/50 border border-card-border rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                    <BrainCircuit className="w-3 h-3 text-white" />
                  </span>
                  <span className="text-xs font-bold text-white">Aziz AI</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  Salom! Men Aziz — Mahalla Monitor AI Yordamchisiman.<br/>
                  Tizim ma'lumotlari asosida professional tahlil beraman. Nima haqida bilishni xohlaysiz?
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">📊 Umumiy holat</button>
                  <button className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">🔥 Eng xavfli tuman</button>
                  <button className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">📉 Davomat muammosi</button>
                  <button className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">⚠️ Jinoyatchilik o'sishi</button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Savol yozing... (Enter — yuborish, Shift+Enter — yangi qator)"
                className="w-full bg-[#0d152e] border border-card-border rounded-xl pl-4 pr-12 py-4 text-sm text-white placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Graph Section */}
          <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">6 OYLIK PROGNOZ</h3>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-danger" />
                  Xavf Tendentsiyasi
                </h2>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-card-border bg-card hover:bg-card/80 text-xs font-medium text-foreground/70 transition-colors">
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
            <div className="relative h-64 border-l border-b border-card-border/30 pl-2 pb-2">
              <div className="absolute left-2 bottom-0 right-0 h-1/2 bg-gradient-to-t from-danger/10 to-transparent"></div>
              {/* Mock Chart Points */}
              <div className="absolute bottom-[50%] left-2 right-0 h-0.5 bg-danger opacity-80 flex justify-between items-center px-4">
                <div className="w-2 h-2 rounded-full bg-danger ring-2 ring-[#091024]"></div>
                <div className="w-2 h-2 rounded-full bg-danger ring-2 ring-[#091024]"></div>
                <div className="w-2 h-2 rounded-full bg-danger ring-2 ring-[#091024]"></div>
                <div className="w-2 h-2 rounded-full bg-danger ring-2 ring-[#091024]"></div>
                <div className="w-2 h-2 rounded-full bg-danger ring-2 ring-[#091024]"></div>
                <div className="w-2 h-2 rounded-full bg-danger ring-2 ring-[#091024]"></div>
              </div>
              <div className="absolute bottom-[-24px] left-2 right-0 flex justify-between text-[10px] text-foreground/40 px-4">
                <span>Yan</span><span>Fev</span><span>Mar</span><span>Apr</span><span>May</span><span>Iyn</span>
              </div>
              <div className="absolute left-[-28px] top-0 bottom-0 flex flex-col justify-between text-[10px] text-foreground/40 pb-2">
                <span>2.10</span><span>2.05</span><span>2.00</span><span>1.95</span><span>1.90</span><span>1.85</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Narrow) */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">TUMAN TAHLILI</h3>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <ShieldAlert className="w-5 h-5 text-danger" />
              Tuman Hisoboti
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">TUMAN TANLANG</label>
                <div className="relative">
                  <select className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                    <option>Bektemir</option>
                    <option>Chilonzor</option>
                    <option>Yunusobod</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                Tahlil Qilish
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">REAL VAQT</h3>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-primary" />
              AI Ko'rsatkichlar
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                <span className="text-sm text-foreground/70">Yuqori xavf ulushi</span>
                <span className="text-sm font-bold text-danger">0%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                <span className="text-sm text-foreground/70">O'rtacha davomat</span>
                <span className="text-sm font-bold text-safe">0%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                <span className="text-sm text-foreground/70">Monitoring kuzatuvi</span>
                <span className="text-sm font-bold text-primary">556 mahalla</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-foreground/70">Faol yoshlar</span>
                <span className="text-sm font-bold text-white">0 nafar</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-card-border/50 min-h-[150px]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">AI RISK SCORING</h3>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-warning" />
              Top 10 Xavf Reytingi
            </h2>
            <div className="flex items-center justify-center h-20 opacity-50 text-sm">
               Ma'lumot topilmadi
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

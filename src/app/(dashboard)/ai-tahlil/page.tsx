"use client";

import { useI18n } from "@/lib/i18n";
import { BrainCircuit, Send, Sparkles, FileText, BarChart2, ShieldAlert, CheckCircle, ChevronDown, Trophy, TrendingUp, AlertTriangle, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AITahlilPage() {
  const { t, lang } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    {
      role: 'ai',
      text: "Salom! Men tizimning AI Assistentiman.\nTizim ma'lumotlari asosida professional tahlil beraman. Nima haqida bilishni xohlaysiz?"
    }
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, text: inputValue }];
    setMessages(newMessages);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, {
        role: 'ai',
        text: "Hozircha men test rejimida ishlayapman va to'liq javob bera olmayman."
      }]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

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
          <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col border border-card-border/50 h-[500px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">GEMINI AI YORDAMCHI</h3>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="w-3 h-3 text-white" />
                  </span>
                  AI Assistent
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg border border-card-border bg-card hover:bg-card/80 text-xs font-medium text-foreground/70 transition-colors"
                >
                  Tozalash
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-colors">
                  Tizim Tahlili
                </button>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl p-4 max-w-[80%] ${msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30 text-white'
                      : 'bg-[#131a2d]/50 border border-card-border text-foreground/80'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === 'ai' ? (
                        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0">
                          <BrainCircuit className="w-3 h-3 text-white" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <span className="text-xs font-bold text-white">
                        {msg.role === 'ai' ? 'AI Assistent' : 'Siz'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>

                    {i === 0 && msg.role === 'ai' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => setInputValue("Umumiy holat haqida ma'lumot bering")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">📊 Umumiy holat</button>
                        <button onClick={() => setInputValue("Eng xavfli tuman qaysi?")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">🔥 Eng xavfli tuman</button>
                        <button onClick={() => setInputValue("Davomat muammosi nima?")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">📉 Davomat muammosi</button>
                        <button onClick={() => setInputValue("Jinoyatchilik o'sishi sabablari")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">⚠️ Jinoyatchilik o'sishi</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative shrink-0 mt-auto">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Savol yozing... (Enter — yuborish)"
                className="w-full bg-[#0d152e] border border-card-border rounded-xl pl-4 pr-12 py-4 text-sm text-white placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary disabled:bg-primary/50 text-white rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
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

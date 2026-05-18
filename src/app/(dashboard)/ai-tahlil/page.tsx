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
      text: lang === 'uz' ? "Salom! Men tizimning AI Assistentiman.\nTizim ma'lumotlari asosida professional tahlil beraman. Nima haqida bilishni xohlaysiz?" : "Здравствуйте! Я AI Ассистент системы.\nПредоставляю профессиональный анализ на основе данных системы. О чем вы хотите узнать?"
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
        text: lang === 'uz' ? "Hozircha men test rejimida ishlayapman va to'liq javob bera olmayman." : "На данный момент я работаю в тестовом режиме и не могу дать полный ответ."
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
            {lang === 'uz' ? "GEMINI 2.0 FLASH - REAL VAQT TAHLIL" : "GEMINI 2.0 FLASH - АНАЛИТИКА В РЕАЛЬНОМ ВРЕМЕНИ"}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            {lang === 'uz' ? "AI Tahlil Markazi" : "Аналитический центр ИИ"}
          </h1>
          <p className="text-xs text-foreground/50">
            {lang === 'uz' ? "Google Gemini asosida professional yoshlar monitoring tahlili, bashorat va strategik tavsiyalar." : "Профессиональный мониторинг молодежи на базе Google Gemini, прогнозы и стратегические рекомендации."}
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
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "GEMINI AI YORDAMCHI" : "GEMINI AI ПОМОЩНИК"}</h3>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="w-3 h-3 text-foreground" />
                  </span>
                  {lang === 'uz' ? "AI Assistent" : "AI Ассистент"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg border border-card-border bg-card hover:bg-card/80 text-xs font-medium text-foreground/70 transition-colors"
                >
                  {lang === 'uz' ? "Tozalash" : "Очистить"}
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-colors">
                  {lang === 'uz' ? "Tizim Tahlili" : "Анализ системы"}
                </button>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl p-4 max-w-[80%] ${msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30 text-foreground'
                      : 'bg-card/50 border border-card-border text-foreground/80'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === 'ai' ? (
                        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0">
                          <BrainCircuit className="w-3 h-3 text-foreground" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-foreground" />
                        </span>
                      )}
                      <span className="text-xs font-bold text-foreground">
                        {msg.role === 'ai' ? (lang === 'uz' ? 'AI Assistent' : 'AI Ассистент') : (lang === 'uz' ? 'Siz' : 'Вы')}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>

                    {i === 0 && msg.role === 'ai' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => setInputValue(lang === 'uz' ? "Umumiy holat haqida ma'lumot bering" : "Общая информация")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground transition-colors">📊 {lang === 'uz' ? "Umumiy holat" : "Общая информация"}</button>
                        <button onClick={() => setInputValue(lang === 'uz' ? "Eng xavfli tuman qaysi?" : "Самый опасный район?")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground transition-colors">🔥 {lang === 'uz' ? "Eng xavfli tuman" : "Самый опасный район"}</button>
                        <button onClick={() => setInputValue(lang === 'uz' ? "Davomat muammosi nima?" : "Проблемы с посещаемостью?")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground transition-colors">📉 {lang === 'uz' ? "Davomat muammosi" : "Проблема посещаемости"}</button>
                        <button onClick={() => setInputValue(lang === 'uz' ? "Jinoyatchilik o'sishi sabablari" : "Причины роста преступности")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground transition-colors">⚠️ {lang === 'uz' ? "Jinoyatchilik o'sishi" : "Рост преступности"}</button>
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
                placeholder={lang === 'uz' ? "Savol yozing... (Enter — yuborish)" : "Напишите вопрос... (Enter — отправить)"}
                className="w-full bg-[#0d152e] border border-card-border rounded-xl pl-4 pr-12 py-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
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
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "6 OYLIK PROGNOZ" : "ПРОГНОЗ НА 6 МЕСЯЦЕВ"}</h3>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-danger" />
                  {lang === 'uz' ? "Xavf Tendentsiyasi" : "Тенденция риска"}
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
                {lang === 'uz' ? (
                  <><span>Yan</span><span>Fev</span><span>Mar</span><span>Apr</span><span>May</span><span>Iyn</span></>
                ) : (
                  <><span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span></>
                )}
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
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "TUMAN TAHLILI" : "АНАЛИЗ РАЙОНА"}</h3>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
              <ShieldAlert className="w-5 h-5 text-danger" />
              {lang === 'uz' ? "Tuman Hisoboti" : "Отчет по району"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "TUMAN TANLANG" : "ВЫБЕРИТЕ РАЙОН"}</label>
                <div className="relative">
                  <select className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                    <option>{lang === 'uz' ? "Bektemir" : "Бектемирский"}</option>
                    <option>{lang === 'uz' ? "Chilonzor" : "Чиланзарский"}</option>
                    <option>{lang === 'uz' ? "Yunusobod" : "Юнусабадский"}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                {lang === 'uz' ? "Tahlil Qilish" : "Анализировать"}
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "REAL VAQT" : "РЕАЛЬНОЕ ВРЕМЯ"}</h3>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-primary" />
              {lang === 'uz' ? "AI Ko'rsatkichlar" : "AI Показатели"}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                <span className="text-sm text-foreground/70">{lang === 'uz' ? "Yuqori xavf ulushi" : "Доля высокого риска"}</span>
                <span className="text-sm font-bold text-danger">0%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                <span className="text-sm text-foreground/70">{lang === 'uz' ? "O'rtacha davomat" : "Средняя посещаемость"}</span>
                <span className="text-sm font-bold text-safe">0%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                <span className="text-sm text-foreground/70">{lang === 'uz' ? "Monitoring kuzatuvi" : "Мониторинг"}</span>
                <span className="text-sm font-bold text-primary">556 {lang === 'uz' ? "mahalla" : "махалля"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-foreground/70">{lang === 'uz' ? "Faol yoshlar" : "Активная молодежь"}</span>
                <span className="text-sm font-bold text-foreground">0 {lang === 'uz' ? "nafar" : "чел."}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-card-border/50 min-h-[150px]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "AI RISK SCORING" : "AI ОЦЕНКА РИСКОВ"}</h3>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-warning" />
              {lang === 'uz' ? "Top 10 Xavf Reytingi" : "Топ 10 Рейтинг Рисков"}
            </h2>
            <div className="flex items-center justify-center h-20 opacity-50 text-sm">
              {lang === 'uz' ? "Ma'lumot topilmadi" : "Данные не найдены"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

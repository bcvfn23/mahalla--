"use client";

import { BrainCircuit, AlertTriangle, Lightbulb, TrendingUp, Send, Loader2, User, Bot, X } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getFriendlyAIErrorMessage } from "@/lib/ai-errors";

export default function RightAISidebar() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const pathname = usePathname();
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("toggleRightSidebar", handleToggle);
    window.addEventListener("closeRightSidebar", handleClose);

    handleClose();

    return () => {
      window.removeEventListener("toggleRightSidebar", handleToggle);
      window.removeEventListener("closeRightSidebar", handleClose);
    };
  }, [pathname]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          context: `User Role: ${user?.role || 'Guest'}, User Name: ${user?.name || 'Unknown'}, Language: ${lang}`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Network response was not ok");
      }

      setMessages(prev => [...prev, { role: "ai", text: data.text }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "";
      setMessages(prev => [...prev, { role: "ai", text: getFriendlyAIErrorMessage(errorMsg, lang) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Right AI Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm xl:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={cn(
        "w-80 bg-card/40 backdrop-blur-md border-l border-card-border p-4 flex flex-col h-full overflow-hidden transition-transform duration-300 z-50 shrink-0",
        "fixed inset-y-0 right-0 xl:static xl:translate-x-0",
        isOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"
      )}>
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary animate-pulse" />
            <h2 className="text-lg font-bold text-foreground">{t("ai.title")}</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-foreground/50 hover:text-foreground hover:bg-background/80 rounded-lg xl:hidden transition-colors"
            title="Close AI Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
          {/* If no messages, show the static insights as placeholders */}
          {messages.length === 0 && (
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl glass-panel border-l-4 border-l-danger"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-danger mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("ai.risk_title")}</p>
                    <p className="text-xs text-foreground/70 mt-1">{t("ai.risk_desc")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl glass-panel border-l-4 border-l-warning"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("ai.hotspot_title")}</p>
                    <p className="text-xs text-foreground/70 mt-1">{t("ai.hotspot_desc")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl glass-panel border-l-4 border-l-safe"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-safe mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("ai.rec_title")}</p>
                    <p className="text-xs text-foreground/70 mt-1">{t("ai.rec_desc")}</p>
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-[11px] text-center text-primary font-medium">{lang === 'uz' ? "Savollaringizni pastda yozib qoldiring" : "Задайте свои вопросы ниже"}</p>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col gap-1 max-w-[90%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-1.5 px-1">
                {msg.role === "user" ? (
                  <>
                    <span className="text-[10px] font-bold text-foreground/50 uppercase">{user?.name || "Siz"}</span>
                    <User className="w-3 h-3 text-foreground/50" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase">Mahalla AI</span>
                  </>
                )}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm",
                msg.role === "user" 
                  ? "bg-primary text-white rounded-tr-sm shadow-[0_0_15px_rgba(14,165,233,0.3)]" 
                  : "bg-card border border-card-border text-foreground rounded-tl-sm shadow-lg"
              )}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto items-start max-w-[90%] flex flex-col gap-1"
            >
               <div className="flex items-center gap-1.5 px-1">
                  <Bot className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase">Mahalla AI</span>
               </div>
               <div className="p-3 rounded-2xl bg-card border border-card-border rounded-tl-sm flex items-center gap-2 shadow-lg">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-xs text-foreground/60">{lang === 'uz' ? "O'ylamoqda..." : "Думает..."}</span>
               </div>
            </motion.div>
          )}
        </div>

        {/* Chat Input Field */}
        <div className="mt-auto pt-4 border-t border-card-border shrink-0">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={lang === 'uz' ? "AI ga savol bering..." : "Спросите ИИ..."}
              className="w-full bg-background border border-card-border rounded-xl pl-4 pr-10 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

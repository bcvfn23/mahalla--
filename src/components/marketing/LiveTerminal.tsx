"use client";

import React, { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const logs = [
  { type: "info", text: "Tizim ishga tushdi. Modellar yuklanmoqda..." },
  { type: "success", text: "AI Model: Yoshlar xulq-atvori tahlili v2.4 faol." },
  { type: "info", text: "Ma'lumotlar bazasi bilan sinxronizatsiya: 45,021 yoshlar profili." },
  { type: "warning", text: "Diqqat: Toshkent viloyati, Chilonzor tumanida anomaliya aniqlandi." },
  { type: "info", text: "Profil ID #84920 tahlil qilinmoqda..." },
  { type: "success", text: "Profil tahlili yakunlandi. Xavf darajasi: Past." },
  { type: "info", text: "Yangi murojaatlar kutilmoqda..." },
  { type: "warning", text: "Diqqat: Maktab davomatida pasayish qayd etildi (ID #3321)." },
  { type: "success", text: "Tizim profillarni avtomatik yangilashni muvaffaqiyatli yakunladi." },
  { type: "info", text: "Real vaqt monitoringi davom etmoqda..." },
];

export default function LiveTerminal() {
  const [activeLogs, setActiveLogs] = useState<typeof logs>([]);
  const { lang } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setActiveLogs((prev) => {
        const newLogs = [...prev, logs[index]];
        if (newLogs.length > 6) newLogs.shift();
        return newLogs;
      });
      index = (index + 1) % logs.length;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeLogs]);

  return (
    <div className="w-full bg-[#0d1117] border border-card-border rounded-xl overflow-hidden shadow-2xl font-mono text-xs sm:text-sm text-left">
      <div className="bg-[#161b22] px-4 py-2 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground/50">
          <Terminal className="w-4 h-4" />
          <span>{lang === 'uz' ? "Bashoratli AI Terminal" : "Терминал ИИ Прогнозирования"}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>
      <div ref={containerRef} className="p-4 h-48 sm:h-64 overflow-y-auto space-y-2 scroll-smooth">
        {activeLogs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-foreground/30">[{new Date().toLocaleTimeString()}]</span>
            <span
              className={
                log.type === "info"
                  ? "text-blue-400"
                  : log.type === "success"
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            >
              {log.type === "info" ? "INFO" : log.type === "success" ? "OK" : "WARN"}:
            </span>
            <span className="text-foreground/80">{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

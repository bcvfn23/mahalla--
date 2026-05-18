"use client";

import { useI18n } from "@/lib/i18n";
import { Zap, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function IntegratsiyalarPage() {
  const { t, lang } = useI18n();

  const initialIntegrations = [
    {
      id: "kundalik",
      name: "kundalik.com",
      status: "ONLINE",
      statusColor: "bg-safe",
      desc: lang === 'uz' ? "Davomat va fan kesimlari sinxron holatda." : "Синхронизация посещаемости и предметов.",
      connected: 47,
      errors: 3,
      ping: "124ms",
      lastSync: lang === 'uz' ? "5 daqiqa oldin" : "5 минут назад",
      syncing: false
    },
    {
      id: "mandat",
      name: "mandat.uz",
      status: "ONLINE",
      statusColor: "bg-safe",
      desc: lang === 'uz' ? "Imtihon natijalari va yo'nalishlar yangilangan." : "Результаты экзаменов и направления обновлены.",
      connected: 31,
      errors: 1,
      ping: "82ms",
      lastSync: lang === 'uz' ? "7 daqiqa oldin" : "7 минут назад",
      syncing: false
    }
  ];

  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [syncingAll, setSyncingAll] = useState(false);

  const handleSync = (id: string) => {
    setIntegrations(prev => prev.map(item => item.id === id ? { ...item, syncing: true } : item));
    
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            syncing: false,
            lastSync: lang === 'uz' ? "hoziroq" : "только что"
          };
        }
        return item;
      }));
      toast.success(lang === 'uz' ? "Sinxronizatsiya muvaffaqiyatli yakunlandi" : "Синхронизация успешно завершена");
    }, 1500);
  };

  const handleSyncAll = () => {
    setSyncingAll(true);
    setIntegrations(prev => prev.map(item => ({ ...item, syncing: true })));
    
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => ({
        ...item,
        syncing: false,
        lastSync: lang === 'uz' ? "hoziroq" : "только что"
      })));
      setSyncingAll(false);
      toast.success(lang === 'uz' ? "Barcha tizimlar sinxronlandi" : "Все системы синхронизированы");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            API VA EXTERNAL TIZIMLAR
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Integratsiya boshqaruvi" : "Управление интеграциями"}
          </h1>
        </div>
        <button 
          onClick={handleSyncAll}
          disabled={syncingAll}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-foreground rounded-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
        >
          {syncingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {lang === 'uz' ? "Barcha xizmatlarni sinxronlash" : "Синхронизировать все"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div key={item.id} className="glass-panel p-6 rounded-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-card border border-card-border flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${item.statusColor}`}></span>
                    <span className="text-xs font-bold text-safe tracking-wider">{item.status}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleSync(item.id)}
                disabled={item.syncing || syncingAll}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-card-border rounded-lg text-xs font-medium text-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {item.syncing ? <Loader2 className="w-3 h-3 text-primary animate-spin" /> : <Zap className="w-3 h-3 text-primary" />}
                Sync
              </button>
            </div>

            <p className="text-sm text-foreground/70 mb-8">{item.desc}</p>

            <div className="bg-[#060b17]/50 rounded-xl p-4 grid grid-cols-3 gap-4 border border-card-border mb-6">
              <div className="text-center border-r border-card-border/50">
                <div className="text-2xl font-black text-safe">{item.connected}</div>
                <div className="text-[10px] font-bold text-foreground/50 uppercase mt-1">ULANGAN</div>
              </div>
              <div className="text-center border-r border-card-border/50">
                <div className="text-2xl font-black text-danger">{item.errors}</div>
                <div className="text-[10px] font-bold text-foreground/50 uppercase mt-1">XATO</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-primary">{item.ping}</div>
                <div className="text-[10px] font-bold text-foreground/50 uppercase mt-1">PING</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground/50">
              <Clock className="w-3 h-3" />
              <span>Oxirgi sinxron: <strong className="text-foreground/80">{item.lastSync}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

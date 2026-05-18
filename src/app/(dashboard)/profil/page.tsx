"use client";

import { useI18n } from "@/lib/i18n";
import { DownloadCloud, ShieldCheck, Moon, Bell, RefreshCw, Power } from "lucide-react";

export default function ProfilPage() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {lang === 'uz' ? "Profil va sozlamalar" : "Профиль и настройки"}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-safe/10 border border-safe/20 rounded-full text-safe text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>ERI Tasdiqlangan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-end min-h-[400px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/20 transition-all duration-500" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] flex items-center justify-center border border-primary/30 mb-6 shadow-lg shadow-primary/20">
              <span className="text-3xl font-black text-white">AD</span>
            </div>
            
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">MAS'UL SHAXS</h3>
            <h2 className="text-3xl font-black text-white mb-2">Tizim Boshqaruvchisi</h2>
            <p className="text-sm text-foreground/60 mb-6">Mahalla Monitor Bosh Administratori</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#1e3a8a]/30 text-[#93c5fd] border border-[#1e3a8a] rounded-full text-xs font-bold">1-toifa</span>
              <span className="px-3 py-1 bg-card border border-card-border rounded-full text-xs font-bold text-foreground/70">Toshkent shahri</span>
              <span className="px-3 py-1 bg-safe/10 text-safe border border-safe/20 rounded-full text-xs font-bold">E-IMZO faol</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">SOZLAMALAR</h3>
            <h2 className="text-lg font-bold text-white mb-6">
              {lang === 'uz' ? "Shaxsiy parametrlar" : "Личные параметры"}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-card-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><Bell className="w-4 h-4"/></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{lang === 'uz' ? "Bildirishnomalar" : "Уведомления"}</h4>
                    <p className="text-xs text-foreground/50 mt-0.5">{lang === 'uz' ? "Xavf oshganda tezkor AI ogohlantirish yuborilishi." : "Отправка быстрых AI оповещений при росте риска."}</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-card-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 text-warning rounded-lg"><Moon className="w-4 h-4"/></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{lang === 'uz' ? "Qorong'i rejim (Dark Mode)" : "Темный режим (Dark Mode)"}</h4>
                    <p className="text-xs text-foreground/50 mt-0.5">{lang === 'uz' ? "Interfeysning doimiy tungi premium ko'rinishi." : "Постоянный ночной премиум-вид интерфейса."}</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-card-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-safe/10 text-safe rounded-lg"><RefreshCw className="w-4 h-4"/></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{lang === 'uz' ? "Avtomatik API sinxronizatsiya" : "Автоматическая синхронизация API"}</h4>
                    <p className="text-xs text-foreground/50 mt-0.5">{lang === 'uz' ? "Har 5 daqiqada Maktab va DTM bilan ulanish." : "Подключение к Maktab и DTM каждые 5 минут."}</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'uz' ? "Ma'lumotlarni shifrlangan eksporti" : "Зашифрованный экспорт данных"}
              </h4>
              <p className="text-xs text-foreground/50">
                {lang === 'uz' ? "Yoshlar ro'yxatini xavfsiz JSON shaklida olish." : "Получение списка молодежи в безопасном формате JSON."}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-card-border rounded-xl text-xs font-bold text-primary group-hover:bg-primary/10 transition-colors">
              <DownloadCloud className="w-4 h-4" />
              {lang === 'uz' ? "Yuklab olish" : "Скачать"}
            </button>
          </div>
          
          <button className="w-full glass-panel p-4 rounded-xl flex items-center justify-center gap-2 text-danger font-bold text-sm hover:bg-danger/10 border border-transparent hover:border-danger/30 transition-colors">
             <Power className="w-4 h-4" />
             {lang === 'uz' ? "Tizimdan chiqish" : "Выйти из системы"}
          </button>
        </div>
      </div>
    </div>
  );
}

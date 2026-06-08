"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Activity, Map, ArrowRight, ShieldCheck, Lock, Database } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import LiveTerminal from "@/components/marketing/LiveTerminal";
import LiveHeatmap from "@/components/marketing/LiveHeatmap";

export default function LandingPage() {
  const { t, lang, setLang } = useI18n();

  const handleScrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen overflow-y-auto bg-background relative overflow-x-hidden flex flex-col font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-safe/10 blur-[120px]" />
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 lg:px-12 border-b border-card-border bg-background/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.4)] bg-card shrink-0">
            <Image src="/logo.png" alt="Yoshlar Qalqoni AI Logo" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm sm:text-xl font-bold tracking-widest text-foreground drop-shadow-[0_0_10px_rgba(14,165,233,0.8)] truncate">
            YOSHLAR QALQONI<span className="text-primary text-[10px] sm:text-xs ml-1">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-card border border-card-border rounded-lg p-1 mr-1 sm:mr-2">
            <button
              onClick={() => setLang('uz')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'uz' ? 'bg-primary text-white shadow-lg' : 'text-foreground/50 hover:text-foreground'}`}
            >
              UZ
            </button>
            <button
              onClick={() => setLang('ru')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'ru' ? 'bg-primary text-white shadow-lg' : 'text-foreground/50 hover:text-foreground'}`}
            >
              RU
            </button>
          </div>
          <Link href="/login" className="px-4 py-2 sm:px-5 sm:py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap">
            {t("landing.login")}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="w-full max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16 sm:mb-24">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8 mx-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t("landing.badge")}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-foreground via-blue-400 to-primary mb-6 tracking-tight whitespace-pre-line leading-tight">
                {t("landing.title")}
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground/60 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                {t("landing.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                <button 
                  onClick={handleScrollToFeatures}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  {t("landing.about")}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link 
                  href="/api-docs"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-foreground bg-card border border-card-border rounded-xl hover:bg-background/5 transition-all text-center"
                >
                  {t("landing.api")}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Live Previews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20 sm:mb-32">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {lang === 'uz' ? "Bashoratli AI ish jarayonida" : "Прогностический ИИ в действии"}
              </h2>
              <p className="text-foreground/60 mb-4 text-sm sm:text-base">
                {lang === 'uz' 
                  ? "Tizim real vaqt rejimida minglab ma'lumotlarni tahlil qiladi va xavflarni avtomatik aniqlaydi." 
                  : "Система в реальном времени анализирует тысячи записей и автоматически выявляет риски."}
              </p>
              <LiveTerminal />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {lang === 'uz' ? "Interaktiv Xarita (Heatmap)" : "Интерактивная карта (Heatmap)"}
              </h2>
              <p className="text-foreground/60 mb-4 text-sm sm:text-base">
                {lang === 'uz' 
                  ? "Hududlardagi huquqbuzarlik xavfi va ta'lim pasayishini vizual klasterlashtirish." 
                  : "Визуальная кластеризация рисков правонарушений и снижения успеваемости по регионам."}
              </p>
              <LiveHeatmap />
            </motion.div>
          </div>

          {/* Feature highlights */}
          <motion.div
            id="features-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-20 sm:mb-32"
          >
            {[
              { icon: Map, title: t("landing.feat1.title"), desc: t("landing.feat1.desc"), color: "text-safe" },
              { icon: BrainCircuit, title: t("landing.feat2.title"), desc: t("landing.feat2.desc"), color: "text-primary" },
              { icon: Activity, title: t("landing.feat3.title"), desc: t("landing.feat3.desc"), color: "text-danger" }
            ].map((feature, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-3xl bg-card/30 border border-card-border backdrop-blur-sm hover:bg-card/60 transition-colors shadow-lg">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-card border border-card-border flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
                  <feature.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Security & Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 sm:mb-32 bg-gradient-to-br from-card/80 to-background border border-card-border rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
              {lang === 'uz' ? "Davlat darajasidagi xavfsizlik" : "Безопасность государственного уровня"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-safe/10 flex items-center justify-center text-safe mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground">Role-Based Access (RBAC)</h4>
                <p className="text-sm text-foreground/60">Foydalanuvchi huquqlari va E-Imzo orqali qat'iy cheklovlar.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground">AES-256 Shifrlash</h4>
                <p className="text-sm text-foreground/60">Barcha shaxsiy ma'lumotlar tranzit va saqlash vaqtida himoyalangan.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-2">
                  <Database className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground">Ma'lumotlar Maxfiyligi</h4>
                <p className="text-sm text-foreground/60">Qonunchilikka to'liq muvofiq, ma'lumotlarni ishonchli markazlarda saqlash.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-card border-t border-card-border py-8 sm:py-12 px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="opacity-80" />
            <span className="text-sm font-bold text-foreground/80">Yoshlar Qalqoni AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-foreground/60">
            <Link href="/privacy" className="hover:text-primary transition-colors">Maxfiylik Siyosati</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Foydalanish Shartlari</Link>
            <Link href="/guide" className="hover:text-primary transition-colors">Qo'llanma</Link>
            <Link href="/api-docs" className="hover:text-primary transition-colors">API</Link>
          </div>
          <div className="text-xs text-foreground/40 text-center md:text-right">
            &copy; {new Date().getFullYear()} O'zbekiston Respublikasi<br className="hidden sm:block" /> Yoshlar Ishlari Agentligi.
          </div>
        </div>
      </footer>
    </div>
  );
}

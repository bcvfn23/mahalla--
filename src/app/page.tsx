"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, BrainCircuit, Activity, Map, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function LandingPage() {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-safe/10 blur-[120px]" />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-primary glow-safe" />
          <span className="text-xl font-bold tracking-widest text-foreground drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]">
            SAFE MAHALLA<span className="text-primary text-xs ml-1">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-card border border-card-border rounded-lg p-1 mr-4">
            <button
              onClick={() => setLang('uz')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                lang === 'uz' ? 'bg-primary text-white shadow-lg' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              UZ
            </button>
            <button
              onClick={() => setLang('ru')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                lang === 'ru' ? 'bg-primary text-white shadow-lg' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              RU
            </button>
          </div>
          <Link href="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            {t("landing.login")}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t("landing.badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-foreground via-blue-400 to-primary mb-6 tracking-tight whitespace-pre-line">
              {t("landing.title")}
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-foreground/60 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t("landing.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2">
                {t("landing.about")}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 text-base font-medium text-foreground bg-card border border-card-border rounded-lg hover:bg-background/5 transition-all">
                {t("landing.api")}
              </button>
            </div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left pb-10"
          >
            {[
              { icon: Map, title: t("landing.feat1.title"), desc: t("landing.feat1.desc"), color: "text-safe" },
              { icon: BrainCircuit, title: t("landing.feat2.title"), desc: t("landing.feat2.desc"), color: "text-primary" },
              { icon: Activity, title: t("landing.feat3.title"), desc: t("landing.feat3.desc"), color: "text-danger" }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card/30 border border-card-border backdrop-blur-sm hover:bg-card/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-card border border-card-border flex items-center justify-center mb-4">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/50">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, BrainCircuit, Activity, Map, ArrowRight } from "lucide-react";

export default function LandingPage() {
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
          <span className="text-xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]">
            SAFE MAHALLA<span className="text-primary text-xs ml-1">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Войти в систему
          </Link>
          <Link href="/dashboard" className="px-5 py-2 text-sm font-medium text-white bg-primary/20 border border-primary/50 hover:bg-primary/30 rounded-full transition-all glow-safe">
            Демонстрация
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
              Next-Generation Government AI Technology
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-primary mb-6 tracking-tight">
              Интеллектуальная Аналитика <br className="hidden md:block" />
              Безопасности Города
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
              Платформа предиктивной аналитики уровня Enterprise. Мониторинг преступности в реальном времени, выявление очагов опасности и генерация рекомендаций с помощью искусственного интеллекта для структур МВД и Smart City.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2">
                Запустить Дашборд
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-card border border-white/10 rounded-lg hover:bg-white/5 transition-all">
                Документация API
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
              { icon: Map, title: "Интерактивный Heatmap", desc: "Визуализация зон риска и патрулирования на детализированной карте города.", color: "text-safe" },
              { icon: BrainCircuit, title: "Предиктивный ИИ", desc: "Прогнозирование роста преступности на основе исторических данных и трендов.", color: "text-primary" },
              { icon: Activity, title: "Мониторинг 24/7", desc: "Анализ данных в реальном времени с автоматической системой уведомлений.", color: "text-danger" }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card/30 border border-white/5 backdrop-blur-sm hover:bg-card/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

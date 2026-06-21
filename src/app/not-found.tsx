"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useI18n();

  const titleUz = "Sahifa topilmadi";
  const titleRu = "Страница не найдена";
  
  const descUz = "Siz so'ragan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin. Kiritilgan manzilni qayta tekshirib ko'ring.";
  const descRu = "Запрошенная страница не существует или была удалена. Пожалуйста, проверьте введённый адрес.";

  const btnUz = "Bosh sahifaga qaytish";
  const btnRu = "Вернуться на главную";

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden font-sans p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-danger/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full space-y-8 px-4">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mx-auto w-24 h-24 rounded-3xl bg-danger/10 border border-danger/20 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.15)]"
        >
          <AlertTriangle className="h-12 w-12 text-danger animate-pulse" />
        </motion.div>

        {/* 404 Text */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30 select-none"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl font-bold text-foreground"
          >
            {lang === "uz" ? titleUz : titleRu}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-foreground/50 leading-relaxed"
          >
            {lang === "uz" ? descUz : descRu}
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-card hover:bg-card-border/30 text-foreground border border-card-border hover:border-primary/45 rounded-2xl text-sm font-bold transition-all hover:shadow-[0_0_25px_rgba(14,165,233,0.25)] group"
          >
            <ArrowLeft className="h-4 w-4 text-foreground/75 group-hover:-translate-x-1 transition-transform" />
            {lang === "uz" ? btnUz : btnRu}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

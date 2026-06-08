import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-card-border bg-card/50 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
        <Link href="/" className="p-2 rounded-full hover:bg-background/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground/70" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Foydalanish Shartlari</h1>
      </header>
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-10">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold mb-8">Platformadan Foydalanish Qoidalari</h2>
        
        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">1. Umumiy qoidalar</h3>
            <p>
              Ushbu qoidalar O'zbekiston Respublikasi Yoshlar ishlari agentligi tomonidan taqdim etilayotgan "Yoshlar Qalqoni AI" tizimidan 
              foydalanish tartibini belgilaydi. Tizimdan foydalanish orqali siz ushbu qoidalarga to'liq roziligingizni bildirasiz.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">2. Mas'uliyat va vakolatlar</h3>
            <p>
              Tizimdan foydalanuvchi davlat xodimlari (yetakchilar, inspektorlar, raislar) o'zlariga berilgan login va parolni 
              uchinchi shaxslarga bermaslikka majburdirlar. Tizimdagi olingan barcha ma'lumotlar faqat xizmat doirasida ishlatilishi lozim.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

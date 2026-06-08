import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Users } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-card-border bg-card/50 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
        <Link href="/" className="p-2 rounded-full hover:bg-background/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground/70" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Foydalanish Qo'llanmasi</h1>
      </header>
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-10">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold mb-8">Platformadan qanday foydalaniladi?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-card border border-card-border rounded-2xl">
            <Layers className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Yoshlar Yetakchisi uchun</h3>
            <p className="text-sm text-foreground/70">
              1. Tizimga "Tizimga kirish" tugmasi orqali shaxsiy loginingiz bilan kiring.<br/><br/>
              2. "Yoshlar" bo'limida o'z mahallangizdagi yoshlarning ro'yxatini ko'rasiz. AI tomonidan "Yuqori xavf" deb belgilangan yoshlar doimo ro'yxatning boshida turadi.<br/><br/>
              3. Ular bilan suhbat o'tkazib, natijalarni tizimga kiriting.
            </p>
          </div>

          <div className="p-6 bg-card border border-card-border rounded-2xl">
            <Users className="w-8 h-8 text-safe mb-4" />
            <h3 className="font-bold text-lg mb-2">Profilaktika Inspektori uchun</h3>
            <p className="text-sm text-foreground/70">
              1. "Huquqbuzarliklar" yoki "Xarita" bo'limiga o'ting.<br/><br/>
              2. Jinoyat sodir etish ehtimoli yuqori bo'lgan hududlardagi "Qizil" nuqtalarni kuzatib boring.<br/><br/>
              3. Profilaktik tadbirlarni shu hududlarda kuchaytirish uchun avtomatlashtirilgan hisobotlarni yuklab oling.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

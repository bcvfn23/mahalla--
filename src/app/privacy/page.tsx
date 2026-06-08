import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-card-border bg-card/50 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
        <Link href="/" className="p-2 rounded-full hover:bg-background/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground/70" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Maxfiylik Siyosati</h1>
      </header>
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-10">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold mb-8">Yoshlar Qalqoni AI Maxfiylik Siyosati</h2>
        
        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">1. Ma'lumotlarni yig'ish va saqlash</h3>
            <p>
              "Yoshlar Qalqoni AI" tizimi faqat qonuniy asosda va tegishli ruxsatnomalar asosida ishlaydi. 
              Tizimga kiritilgan barcha ma'lumotlar (ism-sharif, JSHSHIR, ta'lim ma'lumotlari, yashash manzili) O'zbekiston Respublikasining 
              "Shaxsga doir ma'lumotlar to'g'risida"gi qonuniga qat'iy rioya qilingan holda yig'iladi va saqlanadi.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">2. Ma'lumotlardan foydalanish maqsadi</h3>
            <p>
              Barcha yig'ilgan ma'lumotlar AI modellari tomonidan faqatgina profilaktik maqsadlarda — yoshlar o'rtasida 
              huquqbuzarliklarning oldini olish, ularning bandligini ta'minlash va to'g'ri yo'naltirish maqsadlaridagina tahlil qilinadi.
              Hech qanday ma'lumot uchinchi shaxslarga tijorat maqsadida berilmaydi.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">3. Himoya choralari (AES-256 va RBAC)</h3>
            <p>
              Barcha ma'lumotlar tranzit vaqtida SSL/TLS, saqlash vaqtida esa AES-256 shifrlash standartlari asosida himoyalangan. 
              Tizimdan foydalanish faqat avtorizatsiyadan o'tgan mas'ul shaxslar (Mahalla raisi, Yoshlar yetakchisi, Uchastka noziri) 
              uchun Role-Based Access Control (RBAC) asosida o'z hududlari doirasida ruxsat etiladi.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

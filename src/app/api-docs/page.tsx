import React from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Key, Database, Activity } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-card-border bg-card/50 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-md">
        <Link href="/" className="p-2 rounded-full hover:bg-background/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground/70" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">API Hujjatlari</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="px-2 py-1 bg-safe/10 text-safe text-xs font-bold rounded">v1.0.4 (Stable)</span>
        </div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold mb-4">Yoshlar Qalqoni AI REST API</h2>
          <p className="text-foreground/70 leading-relaxed max-w-3xl">
            Bu yerda Yoshlar Qalqoni tizimining ochiq va yopiq integratsiya nuqtalari (API endpoints) keltirilgan.
            Davlat idoralari (MIA, Maktabgacha va Maktab Ta'limi Vazirligi, Sog'liqni Saqlash Vazirligi) tizim bilan xavfsiz integratsiya qilish uchun ushbu qoidalardan foydalanishlari mumkin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-card border border-card-border rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Autentifikatsiya</h3>
            <p className="text-sm text-foreground/60">
              Barcha so'rovlar <code className="bg-background px-1 py-0.5 rounded text-primary">Bearer Token</code> orqali himoyalangan.
              Token olish uchun avval E-Imzo orqali avtorizatsiyadan o'tish lozim.
            </p>
          </div>
          <div className="p-6 bg-card border border-card-border rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center text-danger mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Tezlik va Cheklovlar</h3>
            <p className="text-sm text-foreground/60">
              Rate limiting: Har bir IP manzil uchun daqiqasiga 1000 ta so'rov. 
              G'ayritabiiy faollik sezilsa, tizim avtomatik bloklaydi (DDoS himoyasi).
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6">Endpoints</h3>
        
        <div className="space-y-6">
          {/* Endpoint 1 */}
          <div className="border border-card-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-card px-4 py-3 border-b border-card-border flex items-center gap-4">
              <span className="px-3 py-1 bg-safe/20 text-safe text-sm font-bold rounded">GET</span>
              <code className="text-sm font-mono text-foreground/80">/api/v1/youth/risks</code>
            </div>
            <div className="p-4 sm:p-6 bg-background">
              <p className="text-sm text-foreground/70 mb-4">
                Hudud bo'yicha yuqori xavf guruhiga kiruvchi yoshlar statistikasini qaytaradi (Shaxsga doir ma'lumotlarsiz, faqat agregatsiya qilingan raqamlar).
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-foreground/80 overflow-x-auto">
                <pre>
{`{
  "status": "success",
  "data": {
    "region": "Toshkent shahar",
    "total_youth": 154200,
    "high_risk_count": 342,
    "medium_risk_count": 1250,
    "timestamp": "2026-05-20T10:00:00Z"
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="border border-card-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-card px-4 py-3 border-b border-card-border flex items-center gap-4">
              <span className="px-3 py-1 bg-warning/20 text-warning text-sm font-bold rounded">POST</span>
              <code className="text-sm font-mono text-foreground/80">/api/v1/integration/sync</code>
            </div>
            <div className="p-4 sm:p-6 bg-background">
              <p className="text-sm text-foreground/70 mb-4">
                Tashqi idoralar (MIA yoki Maktab) tizimidan yangi jinoyat ishi yoki qoldirilgan darslar bo'yicha ma'lumotlarni qabul qilib, AI tahlilini ishga tushiradi.
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-foreground/80 overflow-x-auto">
                <pre>
{`{
  "status": "processing",
  "job_id": "job_9482abc",
  "message": "Data received. AI model is currently evaluating risk factors."
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

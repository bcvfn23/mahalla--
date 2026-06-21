"use client";

import { ShieldCheck, Lock, User, KeyRound, Fingerprint, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { t, lang } = useI18n();
  const { login, loginWithEImzo } = useAuth();

  // E-IMZO modal state
  const [isEImzoOpen, setIsEImzoOpen] = useState(false);
  const [eImzoStep, setEImzoStep] = useState<'connecting' | 'select_key' | 'password' | 'signing'>('connecting');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyPassword, setKeyPassword] = useState("");
  const [eImzoError, setEImzoError] = useState("");

  // Load saved username if "Remember me" was previously checked
  React.useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUsername");
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(username, password, rememberMe);

    if (result.success) {
      toast.success(t("login.success"));

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
    } else {
      toast.error(result.error || t("login.error"));
    }
  };

  // E-IMZO translations
  const eImzoTexts = {
    uz: {
      title: "E-IMZO orqali kirish",
      connecting: "E-IMZO moduliga ulanish... (localhost:19200)",
      select_key: "E-IMZO kalitini tanlang",
      enter_password: "Kalit parolini kiriting",
      password_placeholder: "Kalit paroli",
      signing: "Chaqiriq imzolanyapti va tasdiqlanyapti...",
      submit: "Imzolash va kirish",
      cancel: "Bekor qilish",
      no_keys: "E-IMZO kalitlari topilmadi",
      certificate: "Sertifikat",
      tin: "STIR",
      fio: "F.I.O",
      error_pass: "Kalit paroli noto'g'ri! (Parol: 123)",
      next: "Keyingi"
    },
    ru: {
      title: "Вход через E-IMZO",
      connecting: "Подключение к модулю E-IMZO... (localhost:19200)",
      select_key: "Выберите ключ ЭЦП",
      enter_password: "Введите пароль ключа",
      password_placeholder: "Пароль ключа",
      signing: "Подписание вызова и проверка подписи...",
      submit: "Подписать и войти",
      cancel: "Отмена",
      no_keys: "Ключи E-IMZO не найдены",
      certificate: "Сертификат",
      tin: "ИНН",
      fio: "Ф.И.О",
      error_pass: "Неверный пароль ключа! (Пароль: 123)",
      next: "Далее"
    }
  }[lang === 'uz' ? 'uz' : 'ru'];

  const mockKeys = [
    { username: "admin", label: "ADMIN (YOSHLAR ISHLARI AGENTLIGI)", tin: "301234567", name: "Yoshlar Qalqoni" },
    { username: "yetakchi", label: "YETAKCHI (YOSHLAR YETAKCHISI)", tin: "301122334", name: "Yoshlar Yetakchisi" },
    { username: "rais", label: "RAISI (MFY RAISI)", tin: "309876543", name: "Mahalla Raisi" },
    { username: "uchastkavoy", label: "UCHASTKAVOY (IIB INSP.)", tin: "307654321", name: "Mahalla Uchastkavoyi" }
  ];

  const handleOpenEImzo = () => {
    setIsEImzoOpen(true);
    setEImzoStep("connecting");
    setEImzoError("");
    setKeyPassword("");
    setSelectedKey(null);
    
    // Simulate connection latency
    setTimeout(() => {
      setEImzoStep("select_key");
    }, 1200);
  };

  const handleEImzoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;
    if (keyPassword !== "123") {
      setEImzoError(eImzoTexts.error_pass);
      return;
    }
    
    setEImzoError("");
    setEImzoStep("signing");
    
    // Simulate signature generation latency
    setTimeout(async () => {
      const result = await loginWithEImzo(selectedKey);
      if (result.success) {
        toast.success(t("login.success"));
        setIsEImzoOpen(false);
      } else {
        setEImzoStep("password");
        setEImzoError(result.error || t("login.error"));
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-primary/30 shadow-[0_0_20px_rgba(14,165,233,0.3)] mb-6 overflow-hidden bg-card">
            <Image src="/logo.png" alt="Yoshlar Qalqoni AI Logo" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Yoshlar Qalqoni</h1>
          <p className="text-foreground/60 text-sm">{t("login.subtitle")}</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-card-border/50 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{t("login.username")}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("login.username_placeholder")}
                    className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 pl-11 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{t("login.password")}</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 pl-11 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-card-border bg-background text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-foreground/70 group-hover:text-foreground transition-colors">{t("login.remember")}</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">{t("login.forgot")}</a>
            </div>

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2">
              <KeyRound className="w-4 h-4" />
              {t("login.submit")}
            </button>

            <div className="pt-4 border-t border-card-border/50">
              <button 
                type="button" 
                onClick={handleOpenEImzo}
                className="w-full py-3 bg-background hover:bg-card border border-card-border/80 text-foreground rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 text-safe cursor-pointer hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] focus:outline-none"
              >
                <ShieldCheck className="w-4 h-4 text-safe animate-pulse" />
                {t("login.e_imzo")}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] text-foreground/40 mt-8 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} {lang === 'uz' ? "O'ZBEKISTON RESPUBLIKASI YOSHLAR ISHLARI AGENTLIGI" : "АГЕНТСТВО ПО ДЕЛАМ МОЛОДЕЖИ РЕСПУБЛИКИ УЗБЕКИСТАН"}
        </p>
      </div>

      {/* E-IMZO Modal Dialog */}
      {isEImzoOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-card-border/50 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsEImzoOpen(false)}
              className="absolute right-6 top-6 text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-safe/10 text-safe border border-safe/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-4">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">{eImzoTexts.title}</h2>
            </div>

            {/* Step 1: Connecting to E-IMZO agent */}
            {eImzoStep === "connecting" && (
              <div className="py-8 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-safe animate-spin mx-auto" />
                <p className="text-sm text-foreground/75 font-medium animate-pulse">{eImzoTexts.connecting}</p>
              </div>
            )}

            {/* Step 2: Select Key */}
            {eImzoStep === "select_key" && (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">{eImzoTexts.select_key}</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {mockKeys.map((key) => (
                    <button
                      key={key.username}
                      onClick={() => {
                        setSelectedKey(key.username);
                        setEImzoStep("password");
                      }}
                      className="w-full text-left p-4 rounded-xl border border-card-border bg-background/50 hover:bg-card hover:border-safe/50 transition-all flex flex-col gap-1 group cursor-pointer"
                    >
                      <span className="text-sm font-bold text-foreground group-hover:text-safe transition-colors">{key.label}</span>
                      <div className="flex items-center justify-between text-xs text-foreground/60 mt-1">
                        <span>{eImzoTexts.fio}: {key.name}</span>
                        <span>{eImzoTexts.tin}: {key.tin}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Enter Certificate password */}
            {eImzoStep === "password" && (
              <form onSubmit={handleEImzoSubmit} className="space-y-4">
                <div className="p-4 rounded-xl border border-safe/20 bg-safe/5 space-y-1 mb-2">
                  <span className="text-[10px] font-bold text-safe uppercase tracking-wider">{eImzoTexts.certificate}</span>
                  <p className="text-sm font-bold text-foreground">
                    {mockKeys.find(k => k.username === selectedKey)?.label}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {eImzoTexts.fio}: {mockKeys.find(k => k.username === selectedKey)?.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider">{eImzoTexts.enter_password}</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      autoFocus
                      placeholder={eImzoTexts.password_placeholder}
                      value={keyPassword}
                      onChange={(e) => setKeyPassword(e.target.value)}
                      className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 pl-11 text-sm text-foreground focus:outline-none focus:border-safe/50 transition-colors"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  </div>
                </div>

                {eImzoError && (
                  <p className="text-xs font-semibold text-destructive animate-bounce">{eImzoError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEImzoStep("select_key")}
                    className="flex-1 py-3 bg-background hover:bg-card border border-card-border/80 text-foreground rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    {eImzoTexts.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-safe to-emerald-600 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    {eImzoTexts.submit}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Signing and verifying */}
            {eImzoStep === "signing" && (
              <div className="py-8 text-center space-y-4 font-medium">
                <Loader2 className="w-12 h-12 text-safe animate-spin mx-auto" />
                <p className="text-sm text-foreground/75 animate-pulse">{eImzoTexts.signing}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

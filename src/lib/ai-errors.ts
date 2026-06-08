export function getFriendlyAIErrorMessage(errorMsg: string, lang: 'uz' | 'ru'): string {
  // Check if it's a 503 / spikes in demand / unavailable error
  const isUnavailable = 
    errorMsg.includes("503") || 
    errorMsg.toLowerCase().includes("unavailable") || 
    errorMsg.toLowerCase().includes("demand") ||
    errorMsg.toLowerCase().includes("temporary");

  if (isUnavailable) {
    if (lang === "uz") {
      return `⚠️ Gemini AI serveri yuklama tufayli vaqtincha band (503).

Iltimos, bir necha soniyadan so'ng qayta urinib ko'ring.`;
    } else {
      return `⚠️ Сервер ИИ временно перегружен из-за высокого спроса (503).

Пожалуйста, повторите попытку через несколько секунд.`;
    }
  }

  // Check if it's a quota or rate limit error
  const isQuota = 
    errorMsg.includes("429") || 
    errorMsg.toLowerCase().includes("quota") || 
    errorMsg.toLowerCase().includes("rate limit") || 
    errorMsg.includes("RESOURCE_EXHAUSTED") ||
    errorMsg.toLowerCase().includes("limit");

  if (isQuota) {
    if (lang === "uz") {
      return `⚠️ AI bepul so'rovlar limiti tugadi (Gemini API 429).

Iltimos, 30-60 soniyadan so'ng qayta urinib ko'ring. Bepul tarif rejasida so'rovlar soni cheklangan.`;
    } else {
      return `⚠️ Превышен лимит бесплатных запросов ИИ (Gemini API 429).

Пожалуйста, подождите 30-60 секунд и повторите попытку. На бесплатном тарифе количество запросов ограничено.`;
    }
  }

  // Check for general connection issues
  const isNetwork = 
    errorMsg.toLowerCase().includes("network") || 
    errorMsg.toLowerCase().includes("fetch") || 
    errorMsg.toLowerCase().includes("failed to fetch");

  if (isNetwork) {
    if (lang === "uz") {
      return `🔌 Serverga ulanishda xatolik yuz berdi.

Internet aloqasini tekshiring yoki tizim administratoriga murojaat qiling.`;
    } else {
      return `🔌 Ошибка подключения к серверу.

Пожалуйста, проверьте интернет-соединение или обратитесь к администратору системы.`;
    }
  }

  // Fallback to standard error
  if (lang === "uz") {
    return `❌ AI javob berishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.\n\nTafsilotlar: ${errorMsg}`;
  } else {
    return `❌ Произошла ошибка при ответе ИИ. Пожалуйста, попробуйте еще раз.\n\nДетали: ${errorMsg}`;
  }
}

import crypto from "crypto";

export function computeDeviceFingerprint(req: Request): string {
  const userAgent = req.headers.get("user-agent") || "";
  const acceptLanguage = req.headers.get("accept-language") || "";
  const secChUaPlatform = req.headers.get("sec-ch-ua-platform") || req.headers.get("x-platform") || "";
  
  const rawString = `${userAgent}|${acceptLanguage}|${secChUaPlatform}`;
  
  return crypto.createHash("sha256").update(rawString).digest("hex");
}

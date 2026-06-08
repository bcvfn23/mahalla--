"use client";

class SoundEngine {
  public setMute(muted: boolean) {}
  public getMute(): boolean { return true; }
  public play(type: "click" | "hover" | "success" | "scan") {}
}

export const soundEngine = typeof window !== "undefined" ? new SoundEngine() : null;

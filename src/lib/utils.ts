import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapRiskClientToDb(clientRisk: string): "LOW" | "MEDIUM" | "HIGH" {
  if (clientRisk === "Yuqori xavf" || clientRisk === "Высокий риск" || clientRisk === "HIGH" || clientRisk === "High") return "HIGH";
  if (clientRisk === "O'rta xavf" || clientRisk === "Средний риск" || clientRisk === "MEDIUM" || clientRisk === "Medium") return "MEDIUM";
  return "LOW";
}

export function mapRiskDbToClient(dbRisk: "LOW" | "MEDIUM" | "HIGH"): string {
  if (dbRisk === "HIGH") return "Yuqori xavf";
  if (dbRisk === "MEDIUM") return "O'rta xavf";
  return "Past xavf";
}

export function mapGenderClientToDb(clientGender: string): "MALE" | "FEMALE" {
  if (clientGender === "Ayol" || clientGender === "Женский" || clientGender === "Женщина" || clientGender === "FEMALE" || clientGender === "Female") return "FEMALE";
  return "MALE";
}

export function mapGenderDbToClient(dbGender: "MALE" | "FEMALE"): string {
  if (dbGender === "FEMALE") return "Ayol";
  return "Erkak";
}

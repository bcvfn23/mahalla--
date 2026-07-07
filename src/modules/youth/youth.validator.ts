export class YouthValidator {
  static validate(data: any) {
    if (!data.ism || data.ism.trim().length < 2) throw new Error("ValidationException: Firstname must be at least 2 characters.");
    if (!data.familiya || data.familiya.trim().length < 2) throw new Error("ValidationException: Lastname must be at least 2 characters.");
    if (!/^\d{14}$/.test(data.jshshir)) throw new Error("ValidationException: JSHSHIR must be exactly 14 digits.");
    if (!/^[A-Z]{2}\d{7}$/.test(data.pasport)) throw new Error("ValidationException: Passport must match format AA1234567.");
    const yilNum = parseInt(data.yil);
    if (isNaN(yilNum) || yilNum < 1990 || yilNum > 2012) {
      throw new Error("ValidationException: Birth year must represent youth age group (14 to 35).");
    }
  }
}

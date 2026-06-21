const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Users with bcrypt hashed passwords
  const usersToSeed = [
    { username: "admin", name: "Yoshlar Qalqoni", role: "admin", pass: "123", avatar: "YQ" },
    { username: "uchastkavoy", name: "Mahalla Uchastkavoyi", role: "uchastkavoy", pass: "123", avatar: "UC" },
    { username: "rais", name: "Mahalla Raisi", role: "raisi", pass: "123", avatar: "MR" },
    { username: "yetakchi", name: "Yoshlar Yetakchisi", role: "yetakchi", pass: "123", avatar: "YY" },
  ];

  for (const u of usersToSeed) {
    const hashedPassword = await bcrypt.hash(u.pass, 12);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {
        name: u.name,
        role: u.role,
        passwordHash: hashedPassword,
        avatar: u.avatar
      },
      create: {
        username: u.username,
        name: u.name,
        role: u.role,
        passwordHash: hashedPassword,
        avatar: u.avatar
      }
    });
  }
  console.log("Users seeded successfully.");

  // Delete all existing data to prevent unique constraint conflicts and clean slate seeding
  await prisma.attendance.deleteMany({});
  await prisma.youthProfile.deleteMany({});
  await prisma.mahalla.deleteMany({});
  await prisma.district.deleteMany({});
  await prisma.region.deleteMany({});

  // 2. Seed Geography (Region -> District -> Mahallas)
  const region = await prisma.region.create({
    data: {
      nameUz: "Sirdaryo viloyati",
      nameRu: "Сырдарьинская область",
    }
  });

  const district = await prisma.district.create({
    data: {
      nameUz: "Guliston tumani",
      nameRu: "Гулистанский район",
      regionId: region.id
    }
  });

  const mahallasUz = ["Guliston", "Do'stlik", "Navro'z", "Shirin", "Oqdaryo", "Yangiyer"];
  const mahallasRu = ["Гулистан", "Дустлик", "Навруз", "Ширин", "Окдарья", "Янгиер"];

  const seededMahallas = [];
  for (let i = 0; i < mahallasUz.length; i++) {
    const mahalla = await prisma.mahalla.create({
      data: {
        nameUz: mahallasUz[i],
        nameRu: mahallasRu[i],
        districtId: district.id
      }
    });
    seededMahallas.push(mahalla);
  }
  console.log("Geography seeded successfully.");

  // 3. Seed some initial youth profiles using the seeded mahallas
  const ismlarErkak = ["Asadbek", "Javohir", "Diyorbek", "Sardor", "Otabek", "Farruh", "Suhrob", "Bekzod", "Shohruh", "Bobur"];
  const ismlarAyol = ["Dilnoza", "Madina", "Shaxnoza", "Kamola", "Laylo", "Sevara", "Nigora", "Zilola", "Guli", "Asila"];
  const familiyalar = ["Karimov", "Rahimov", "Umarov", "Tursunov", "Nazarov", "Solihov", "Rustamov", "Abduvaliyev", "Usmonov", "Eshonov"];

  const kasblarUz = [
    "IT Park - Dasturchi yordamchisi",
    "Yoshlar Markazi - Sport koordinatori",
    "Mahalla Kengashi - Patrul yordamchisi",
    "Ijtimoiy ta'minot - Yoshlar ishlari faoli",
    "Obodonlashtirish departamenti - Inspektor",
  ];

  const seededYouth = [];
  for (let i = 0; i < 30; i++) {
    const isErkak = i % 2 === 0;
    const ism = isErkak ? ismlarErkak[i % ismlarErkak.length] : ismlarAyol[i % ismlarAyol.length];
    let fam = familiyalar[i % familiyalar.length];
    if (!isErkak) fam += "a";

    const jshshir = "3" + Math.floor(1000000000000 + (i * 1456789) % 9000000000000).toString();
    const pasport = "AB" + (2000000 + i * 37).toString().substring(0, 7);
    const yil = (2008 - (i % 11)).toString();
    const jins = isErkak ? "MALE" : "FEMALE";
    const mahalla = seededMahallas[i % seededMahallas.length];
    const telefon = "+998 90 7" + (100000 + i * 31).toString().substring(0, 6);
    const davomat = (90 + (i % 11)).toString();
    const maktab = kasblarUz[i % kasblarUz.length];
    const xavf = i % 5 === 0 ? "HIGH" : i % 5 === 3 ? "MEDIUM" : "LOW";
    const izoh = `Ishga joylashtirildi: ${maktab}.`;

    const profile = await prisma.youthProfile.create({
      data: {
        ism,
        familiya: fam,
        jshshir,
        pasport,
        yil,
        jins,
        telefon,
        davomat,
        xavf,
        maktab,
        izoh,
        mahallaId: mahalla.id
      }
    });
    seededYouth.push(profile);
  }
  console.log("Youth profiles seeded successfully.");

  // 4. Seed Incidents (Huquqbuzarliklar)
  await prisma.incident.deleteMany({});
  const incidentTypesUz = [
    "Huquqbuzarlikka moyillik",
    "Jamoat tartibini buzish",
    "Tungi vaqtda maqsadsiz yurish",
    "Mayda bezorilik"
  ];
  const incidentTypesRu = [
    "Склонность к правонарушениям",
    "Нарушение общественного порядка",
    "Бесцельное хождение в ночное время",
    "Мелкое хулиганство"
  ];

  for (let i = 0; i < 15; i++) {
    const y = seededYouth[i % seededYouth.length];
    const mahalla = seededMahallas[i % seededMahallas.length];
    await prisma.incident.create({
      data: {
        name: `${y.ism} ${y.familiya}`,
        typeUz: incidentTypesUz[i % incidentTypesUz.length],
        typeRu: incidentTypesRu[i % incidentTypesRu.length],
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + " 10:00",
        locationUz: `Sirdaryo viloyati, ${mahalla.nameUz} mahallasi`,
        locationRu: `Сырдарьинская область, махалля ${mahalla.nameRu}`,
        status: i % 3 === 0 ? "yopilgan" : "jarayonda",
        severity: i % 4 === 0 ? "high" : i % 4 === 1 ? "medium" : "low"
      }
    });
  }
  console.log("Incidents seeded successfully.");

  // 5. Seed Appeals (Murojaatlar)
  await prisma.appeal.deleteMany({});
  const appealTypesUz = [
    "Ishga joylashtirishda amaliy yordam",
    "Tadbirkorlik faoliyati uchun kredit olish",
    "IT-markazda o'qish uchun subsidiya",
    "Psixologik yordam olish"
  ];
  const appealTypesRu = [
    "Помощь в трудоустройстве",
    "Получение кредита для предпринимательства",
    "Субсидия для обучения в IT-центре",
    "Получение психологической помощи"
  ];

  for (let i = 0; i < 12; i++) {
    const y = seededYouth[(i + 5) % seededYouth.length];
    await prisma.appeal.create({
      data: {
        fullName: `${y.ism} ${y.familiya}`,
        type: appealTypesUz[i % appealTypesUz.length],
        text: `Murojaat mazmuni: ${appealTypesUz[i % appealTypesUz.length]} bo'yicha amaliy ko'mak so'rayman.`,
        date: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString().slice(0, 10) + " 09:30",
        status: i % 2 === 0 ? "hal etilgan" : "kutilmoqda",
        predictedCategory: i % 2 === 0 ? "Bandlik" : "Ijtimoiy"
      }
    });
  }
  console.log("Appeals seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

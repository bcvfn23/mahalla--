const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data
  await prisma.idempotentConsumer.deleteMany({});
  await prisma.eventOutbox.deleteMany({});
  await prisma.eventParticipant.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.jointReport.deleteMany({});
  await prisma.socialAid.deleteMany({});
  await prisma.employment.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.incident.deleteMany({});
  await prisma.appeal.deleteMany({});
  await prisma.youthProfile.deleteMany({});
  await prisma.mahalla.deleteMany({});
  await prisma.district.deleteMany({});
  await prisma.region.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Users
  const usersToSeed = [
    { username: "admin", name: "Yoshlar Qalqoni", role: "admin", pass: "123", avatar: "YQ" },
    { username: "uchastkavoy", name: "Mahalla Uchastkavoyi", role: "uchastkavoy", pass: "123", avatar: "UC" },
    { username: "rais", name: "Mahalla Raisi", role: "raisi", pass: "123", avatar: "MR" },
    { username: "yetakchi", name: "Yoshlar Yetakchisi", role: "yetakchi", pass: "123", avatar: "YY" },
  ];

  for (const u of usersToSeed) {
    const hashedPassword = await bcrypt.hash(u.pass, 12);
    await prisma.user.create({
      data: {
        username: u.username,
        name: u.name,
        role: u.role,
        passwordHash: hashedPassword,
        avatar: u.avatar
      }
    });
  }
  console.log("Users seeded successfully.");

  // 3. Seed Geography
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

  // 4. Seed Youth Profiles
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
    let fam = familiyalar[(i + Math.floor(i / 10)) % familiyalar.length];
    if (!isErkak) fam += "a";

    const jshshir = "3" + Math.floor(1000000000000 + (i * 1456789) % 9000000000000).toString();
    const pasport = "AB" + (2000000 + i * 37).toString().substring(0, 7);
    const yil = (2008 - (i % 11)).toString();
    const jins = isErkak ? "MALE" : "FEMALE";
    const mahalla = seededMahallas[i % seededMahallas.length];
    const telefon = "+998 90 7" + (100000 + i * 31).toString().substring(0, 6);
    const davomat = (90 + (i % 11)).toString();
    const xavf = i % 5 === 0 ? "HIGH" : i % 5 === 3 ? "MEDIUM" : "LOW";
    const maktab = kasblarUz[i % kasblarUz.length];

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
        izoh: `Ishga joylashtirildi: ${maktab}.`,
        mahallaId: mahalla.id
      }
    });
    seededYouth.push(profile);

    // Create default attendance records
    await prisma.attendance.create({
      data: {
        profileId: profile.id,
        date: new Date(),
        present: parseFloat(davomat) >= 95,
        reason: parseFloat(davomat) < 95 ? "Kasalligi sababli" : null
      }
    });

    // Seed Employment for some profiles
    if (i % 3 === 0) {
      await prisma.employment.create({
        data: {
          profileId: profile.id,
          profession: maktab,
          status: i % 6 === 0 ? "band" : "o'qishda"
        }
      });
    } else {
      await prisma.employment.create({
        data: {
          profileId: profile.id,
          profession: "Dasturlash",
          status: "ishsiz"
        }
      });
    }

    // Seed Social Aid for some profiles
    if (i % 4 === 1) {
      await prisma.socialAid.create({
        data: {
          profileId: profile.id,
          notebookType: i % 2 === 0 ? "yoshlar" : "temir",
          helpType: "Kredit ajratish",
          status: "kutmoqda"
        }
      });
    }
  }
  console.log("Youth profiles, attendance, employment, and social aid seeded successfully.");

  // 5. Seed Incidents (Huquqbuzarliklar)
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
        profileId: y.id,
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

  // 6. Seed Appeals (Murojaatlar)
  const appealTypesUz = [
    "Ishga joylashtirishda amaliy yordam",
    "Tadbirkorlik faoliyati uchun kredit olish",
    "IT-markazda o'qish uchun subsidiya",
    "Psixologik yordam olish"
  ];

  for (let i = 0; i < 12; i++) {
    const y = seededYouth[(i + 5) % seededYouth.length];
    await prisma.appeal.create({
      data: {
        profileId: y.id,
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

  // 7. Seed Events & Participants
  const eventsData = [
    { titleUz: "Zakovat intellektual o'yini (Sirdaryo bosqichi)", date: "2026-05-25", status: "kutilmoqda" },
    { titleUz: "IT-Park Mini-Hackathon 'Cyber Shield'", date: "2026-05-28", status: "jarayonda" },
    { titleUz: "Sport musobaqasi (Stol tennisi turniri)", date: "2026-05-18", status: "yakunlangan" }
  ];

  for (const ed of eventsData) {
    const ev = await prisma.event.create({
      data: {
        titleUz: ed.titleUz,
        titleRu: ed.titleUz, // Simple mapping
        date: ed.date,
        status: ed.status
      }
    });

    // Add some random participants
    const randomParticipantsCount = 3 + (ev.titleUz.length % 5);
    for (let pIdx = 0; pIdx < randomParticipantsCount; pIdx++) {
      const targetYouth = seededYouth[(pIdx * 7) % seededYouth.length];
      await prisma.eventParticipant.create({
        data: {
          eventId: ev.id,
          profileId: targetYouth.id
        }
      }).catch(() => {}); // Prevent duplicates
    }
  }
  console.log("Events and participants seeded successfully.");

  // 8. Seed Joint Patrol Reports
  await prisma.jointReport.create({
    data: {
      timestamp: "2026-05-20 14:12",
      inspectorName: "Kpt. Radjabov O.",
      leaderName: "S. Karimov",
      profileId: seededYouth[0].id,
      mahalla: seededMahallas[0].nameUz,
      descriptionUz: "Yoshlar bilan oilaviy nizolarni hal qilish va ishga joylashtirish bo'yicha profilaktik suhbat o'tkazildi.",
      descriptionRu: "Проведена профилактическая беседа по разрешению семейных конфликтов и трудоустройству молодежи."
    }
  });

  await prisma.jointReport.create({
    data: {
      timestamp: "2026-05-20 11:34",
      inspectorName: "Ltn. Alimov R.",
      leaderName: "M. Usmonova",
      profileId: seededYouth[1].id,
      mahalla: seededMahallas[1].nameUz,
      descriptionUz: "Maktabda dars qoldiruvchi voyaga yetmagan yoshlarning ota-onalari bilan tushuntirish ishlari olib borildi.",
      descriptionRu: "Проведена разъяснительная работа с родителями несовершеннолетних учеников, пропускающих занятия."
    }
  });
  console.log("Joint patrol reports seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

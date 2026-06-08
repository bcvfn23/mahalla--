"use client";

export function initializeYouthDatabase() {
  if (typeof window === "undefined") return;

  const isDone = localStorage.getItem("isYouthIntegrated") === "true";
  if (isDone) return;

  const lang = localStorage.getItem("lang") || "uz";

  const ismlarErkak = ["Asadbek", "Javohir", "Diyorbek", "Sardor", "Otabek", "Farruh", "Suhrob", "Bekzod", "Shohruh", "Bobur", "Jasur", "Umid", "Sanjar", "Mirjalol", "Elbek", "Humoyun", "Abbos", "Ozodbek", "Doston", "Ulug'bek", "Temur", "Rustam", "Aliyor", "Sunnat", "Shodiyor"];
  const ismlarAyol = ["Dilnoza", "Madina", "Shaxnoza", "Kamola", "Laylo", "Sevara", "Nigora", "Zilola", "Guli", "Asila", "Malika", "Zarina", "Sitora", "Ruxshona", "Sabrina", "Ziyoda", "Lola", "Oydin", "Gozal", "Rayhon", "Feruza", "Mohira", "Shahzoda", "Charos", "Nafisa"];
  const familiyalar = ["Karimov", "Rahimov", "Umarov", "Tursunov", "Nazarov", "Solihov", "Rustamov", "Abduvaliyev", "Usmonov", "Eshonov", "Yusupov", "Jalolov", "Aliyev", "Olimov", "Toshpo'latov", "Hakimov", "Sodiqov", "Sultonov", "G'ofurov", "Mirzayev", "Ismoilov", "Qodirov", "Sobirov", "Vahobov", "Xalilov"];
  const mahallalar = ["Guliston", "Do'stlik", "Navro'z", "Shirin", "Oqdaryo", "Yangiyer"];

  const kasblarUz = [
    "IT Park - Dasturchi yordamchisi",
    "Yoshlar Markazi - Sport koordinatori",
    "Mahalla Kengashi - Patrul yordamchisi",
    "Ijtimoiy ta'minot - Yoshlar ishlari faoli",
    "Obodonlashtirish departamenti - Inspektor",
    "Madaniyat markazi - Klub mentor yordamchisi",
    "Kambag'allikni qisqartirish - Bo'lim mutaxassisi",
    "Sirdaryo Yoshlar markazi - IT mutaxassisi"
  ];
  
  const kasblarRu = [
    "IT Park - Помощник программиста",
    "Молодежный центр - Спортивный координатор",
    "Сход граждан махалли - Помощник патруля",
    "Социальное обеспечение - Молодежный активист",
    "Департамент благоустройства - Инспектор",
    "Центр культуры - Ассистент ментора клуба",
    "Сокращение бедности - Специалист отдела",
    "Сырдарьинский молодежный центр - IT-специалист"
  ];

  const kasbTranslation = (idx: number, currentLang: string) => {
    return currentLang === 'uz' ? kasblarUz[idx] : kasblarRu[idx];
  };

  const generatedYouth = [];
  for (let i = 0; i < 50; i++) {
    const isErkak = i % 2 === 0;
    const ism = isErkak ? ismlarErkak[i % ismlarErkak.length] : ismlarAyol[i % ismlarAyol.length];
    let fam = familiyalar[i % familiyalar.length];
    if (!isErkak) fam += "a";
    
    const jshshir = "3" + Math.floor(1000000000000 + (i * 1456789) % 9000000000000).toString();
    const pasport = "AB" + (2000000 + i * 37).toString().substring(0, 7);
    const yil = (2008 - (i % 11)).toString();
    const jins = isErkak ? (lang === 'uz' ? "Erkak" : "Мужской") : (lang === 'uz' ? "Ayol" : "Женский");
    const mahalla = mahallalar[i % mahallalar.length];
    const telefon = "+998 90 7" + (100000 + i * 31).toString().substring(0, 6);
    const davomat = (90 + (i % 11)).toString();
    const maktab = kasbTranslation(i % kasblarUz.length, lang);
    const xavf = lang === 'uz' ? "Past xavf" : "Низкий риск";
    
    let izoh = "";
    if (i % 4 === 0) {
      izoh = lang === 'uz' 
        ? `Hukumat loyihasi bilan [${maktab}] bo'lib ishga kirdi. Murojaatlar bo'limidagi uning bandlik bo'yicha yozgan arizasi muvaffaqiyatli yopildi.`
        : `Трудоустроен [${maktab}] по госпрограмме. Его обращение в отделе занятости успешно завершено и закрыто.`;
    } else if (i % 4 === 1) {
      izoh = lang === 'uz'
        ? `Hukumat loyihasi bilan [${maktab}] bo'lib ishga kirdi. Xavfsizlik bo'limidagi profilaktika ro'yxatidan muvaffaqiyatli chiqarildi.`
        : `Трудоустроен [${maktab}] по госпрограмме. Успешно снят с профилактического учета в отделе безопасности.`;
    } else if (i % 4 === 2) {
      izoh = lang === 'uz'
        ? `Hukumat loyihasi bilan [${maktab}] bo'lib ishga kirdi. Yoshlar/Temir daftar ro'yxatidan muvaffaqiyatli chiqarildi.`
        : `Трудоустроен [${maktab}] по госпрограмме. Успешно исключен из социальной молодежной/железной тетради.`;
    } else {
      izoh = lang === 'uz'
        ? `Hukumat loyihasi bilan [${maktab}] bo'lib ishga kirdi. Mahalla jamoat ishlari va sport tadbirlari faol tashkilotchisi.`
        : `Трудоустроен [${maktab}] по госпрограмме. Активный организатор общественных и спортивных мероприятий махалли.`;
    }

    generatedYouth.push({
      id: `hired_${i}`,
      ism,
      familiya: fam,
      jshshir,
      pasport,
      yil,
      jins,
      maktab,
      telefon,
      davomat,
      mahalla,
      xavf,
      izoh
    });
  }

  // Merge with existing youth
  const existingStr = localStorage.getItem("youthList");
  let existingList = existingStr ? JSON.parse(existingStr) : [];
  existingList = existingList.filter((y: any) => !y.id.startsWith("hired_"));
  const mergedYouth = [...generatedYouth, ...existingList];
  localStorage.setItem("youthList", JSON.stringify(mergedYouth));

  // Seeding Department 1: Bandlik (mehnat.uz)
  const newBandlik = generatedYouth.map((y, idx) => ({
    id: 100 + idx,
    fullName: `${y.ism} ${y.familiya}`,
    profession: y.maktab,
    status: "band"
  }));
  const prevBandlikStr = localStorage.getItem("bandlikList");
  let prevBandlik = prevBandlikStr ? JSON.parse(prevBandlikStr) : [];
  prevBandlik = prevBandlik.filter((p: any) => p.id < 100 || p.id > 150);
  localStorage.setItem("bandlikList", JSON.stringify([...newBandlik, ...prevBandlik]));

  // Seeding Department 2: Rejalar (Kanban tasksList)
  const newTasks = generatedYouth.slice(0, 15).map((y, idx) => ({
    id: 1000 + idx,
    title: lang === 'uz' ? `Ijrochi: ${y.ism} ${y.familiya}` : `Исполнитель: ${y.ism} ${y.familiya}`,
    desc: lang === 'uz' ? `Lavozim: ${y.maktab} bo'yicha mahallada belgilangan yillik reja ijrosini ta'minlash.` : `Выполнение квартального плана на позиции: ${y.maktab}.`,
    status: idx % 3 === 0 ? "todo" : idx % 3 === 1 ? "in_progress" : "done"
  }));
  const prevTasksStr = localStorage.getItem("tasksList");
  let prevTasks = prevTasksStr ? JSON.parse(prevTasksStr) : [];
  prevTasks = prevTasks.filter((t: any) => t.id < 1000 || t.id > 1020);
  localStorage.setItem("tasksList", JSON.stringify([...newTasks, ...prevTasks]));

  // Seeding Department 3: Tanlovlar (Events / eventsList)
  const prevEventsStr = localStorage.getItem("eventsList");
  let prevEvents = prevEventsStr ? JSON.parse(prevEventsStr) : [];
  if (prevEvents.length > 0) {
    prevEvents[0].participants = (parseInt(prevEvents[0].participants) + 20).toString();
    prevEvents[0].status = "jarayonda";
    if (prevEvents[1]) prevEvents[1].participants = (parseInt(prevEvents[1].participants) + 15).toString();
    if (prevEvents[2]) prevEvents[2].participants = (parseInt(prevEvents[2].participants) + 15).toString();
  } else {
    prevEvents = [
      { id: 1, title: "Zakovat intellektual o'yini (Sirdaryo bosqichi)", date: "2026-05-25", participants: "108", status: "jarayonda" },
      { id: 2, title: "IT-Park Mini-Hackathon 'Cyber Shield'", date: "2026-05-28", participants: "74", status: "kutilmoqda" },
      { id: 3, title: "Sport musobaqasi (Stol tennisi turniri)", date: "2026-05-18", participants: "82", status: "yakunlangan" }
    ];
  }
  localStorage.setItem("eventsList", JSON.stringify(prevEvents));

  // Seeding Department 4: Huquqbuzarliklar (MIA incidentsList)
  const prevIncidentsStr = localStorage.getItem("incidentsList");
  let prevIncidents = prevIncidentsStr ? JSON.parse(prevIncidentsStr) : [];
  const closedIncidents = generatedYouth.slice(10, 22).map((y, idx) => ({
    id: 500 + idx,
    name: `${y.ism} ${y.familiya}`,
    typeUz: idx % 2 === 0 ? "Huquqbuzarlikka moyillik" : "Jamoat tartibini buzish",
    typeRu: idx % 2 === 0 ? "Склонность к правонарушениям" : "Нарушение общественного порядка",
    date: new Date().toISOString().slice(0, 10) + " 10:00",
    locationUz: "Sirdaryo viloyati, " + y.mahalla + " mahallasi",
    locationRu: "Сырдарьинская область, махалля " + y.mahalla,
    status: "yopilgan",
    severity: "low"
  }));
  prevIncidents = prevIncidents.filter((inc: any) => inc.id < 500 || inc.id > 520);
  localStorage.setItem("incidentsList", JSON.stringify([...closedIncidents, ...prevIncidents]));

  // Seeding Department 5: Murojaatlar (Appeals appealsList)
  const prevAppealsStr = localStorage.getItem("appealsList");
  let prevAppeals = prevAppealsStr ? JSON.parse(prevAppealsStr) : [];
  const solvedAppeals = generatedYouth.slice(22, 37).map((y, idx) => ({
    id: 600 + idx,
    fullName: `${y.ism} ${y.familiya}`,
    type: lang === 'uz' ? "Ishga joylashtirishda amaliy yordam" : "Помощь в трудоустройстве",
    text: lang === 'uz' ? `Mutaxassisligim bo'yicha bo'sh ish o'rni kerak. [${y.maktab}] sohasiga qiziqaman.` : `Нужна работа по специальности. Интересует сфера [${y.maktab}].`,
    date: new Date().toISOString().slice(0, 10) + " 09:30",
    status: "hal etilgan",
    predictedCategory: "Bandlik"
  }));
  prevAppeals = prevAppeals.filter((ap: any) => ap.id < 600 || ap.id > 620);
  localStorage.setItem("appealsList", JSON.stringify([...solvedAppeals, ...prevAppeals]));

  // Seeding Department 6: Yordam (Social aid yordamList)
  const prevYordamStr = localStorage.getItem("yordamList");
  let prevYordam = prevYordamStr ? JSON.parse(prevYordamStr) : [];
  const solvedYordam = generatedYouth.slice(37, 50).map((y, idx) => ({
    id: 700 + idx,
    fullName: `${y.ism} ${y.familiya}`,
    notebookType: idx % 3 === 0 ? "yoshlar" : idx % 3 === 1 ? "ayol" : "temir",
    helpType: lang === 'uz' ? "Hukumat loyihasi doirasida doimiy bandlik" : "Трудоустройство по госпрограмме",
    status: "hal_etildi"
  }));
  prevYordam = prevYordam.filter((yo: any) => yo.id < 700 || yo.id > 720);
  localStorage.setItem("yordamList", JSON.stringify([...solvedYordam, ...prevYordam]));

  localStorage.setItem("isYouthIntegrated", "true");
  
  // Dispatch events to notify other components in real time
  window.dispatchEvent(new Event("youthAdded"));
  window.dispatchEvent(new Event("incidentsChanged"));
  window.dispatchEvent(new Event("appealsChanged"));
}

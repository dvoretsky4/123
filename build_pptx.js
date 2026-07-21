const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "ГСК технологии";
pres.title = "ГСК технологии — промышленная водоподготовка и очистка сточных вод";

// ---- Brand palette (only these colors) ----
const BLUE = "2C4157";
const DARK = "1E2E3E";
const STEEL = "7C8D9C";
const LIGHT = "D5DBE1";
const BG = "EDF0F3";
const WHITE = "FFFFFF";
const HF = "Arial"; // headings
const BF = "Arial"; // body

const PW = 13.33, PH = 7.5;
const ML = 0.6, MR = 0.6;
const CW = PW - ML - MR; // 12.13

// ---------- helpers ----------
function title(slide, text, opts = {}) {
  const dark = opts.dark || false;
  slide.addText(text.toUpperCase(), {
    x: ML, y: opts.y != null ? opts.y : 0.42, w: CW, h: opts.h || 0.8,
    fontFace: HF, fontSize: opts.size || 30, bold: true,
    color: dark ? WHITE : BLUE, align: "left", valign: "middle",
    charSpacing: 1, margin: 0,
  });
}
function segment(slide, text) {
  slide.addText(text.toUpperCase(), {
    x: ML, y: 0.28, w: CW, h: 0.28, fontFace: HF, fontSize: 11, bold: true,
    color: STEEL, charSpacing: 2, margin: 0, valign: "middle",
  });
}
function footer(slide, n) {
  slide.addText("ГСК ТЕХНОЛОГИИ", {
    x: ML, y: 7.02, w: 5, h: 0.3, fontFace: HF, fontSize: 8.5, color: STEEL,
    charSpacing: 2, margin: 0, valign: "middle",
  });
  slide.addText(String(n), {
    x: PW - MR - 1, y: 7.02, w: 1, h: 0.3, fontFace: HF, fontSize: 8.5,
    color: STEEL, align: "right", margin: 0, valign: "middle",
  });
}
// square-bullet list
function bulletList(slide, items, x, y, w, h, opts = {}) {
  const fs = opts.fontSize || 15;
  slide.addText(items.map((t, i) => ({
    text: t,
    options: {
      bullet: { code: "25AA", indent: 16 }, color: opts.color || DARK,
      fontSize: fs, fontFace: BF, breakLine: true,
      paraSpaceAfter: opts.gap != null ? opts.gap : 8,
    },
  })), { x, y, w, h, valign: "top", margin: 0, lineSpacingMultiple: 1.05 });
}
function photo(slide, x, y, w, h, caption) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: BG }, line: { color: LIGHT, width: 1 } });
  slide.addText([
    { text: caption, options: { fontSize: 12, color: STEEL, fontFace: BF, breakLine: true, align: "center" } },
    { text: "изображение-заполнитель", options: { fontSize: 9, color: STEEL, italic: true, fontFace: BF, align: "center" } },
  ], { x: x + 0.1, y, w: w - 0.2, h, valign: "middle", align: "center", margin: 0 });
}
function stat(slide, x, y, w, number, label, opts = {}) {
  slide.addText(number, {
    x, y, w, h: opts.nh || 0.9, fontFace: HF, fontSize: opts.ns || 46, bold: true,
    color: BLUE, align: opts.align || "left", valign: "bottom", margin: 0, charSpacing: 0,
  });
  slide.addText(label, {
    x, y: y + (opts.nh || 0.9) + 0.02, w, h: 0.5, fontFace: BF, fontSize: opts.ls || 12,
    color: STEEL, align: opts.align || "left", valign: "top", margin: 0,
  });
}
function card(slide, x, y, w, h) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: BG }, line: { color: LIGHT, width: 1 } });
}

// ============================================================
// SLIDE 1 — Титул
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: BLUE };
  // logo mark placeholder
  s.addShape(pres.ShapeType.roundRect, { x: ML, y: 0.7, w: 0.62, h: 0.62, rectRadius: 0.14, fill: { type: "none" }, line: { color: WHITE, width: 2.5 } });
  s.addShape(pres.ShapeType.ellipse, { x: ML + 0.2, y: 0.9, w: 0.22, h: 0.22, fill: { color: WHITE } });
  s.addText("ГСК ТЕХНОЛОГИИ", {
    x: ML, y: 2.4, w: 11.5, h: 1.4, fontFace: HF, fontSize: 60, bold: true,
    color: WHITE, charSpacing: 2, margin: 0, valign: "middle",
  });
  s.addText("Промышленная водоподготовка и очистка сточных вод", {
    x: ML, y: 3.85, w: 11, h: 0.6, fontFace: BF, fontSize: 22, color: LIGHT, margin: 0,
  });
  s.addText("ранее ООО «БМТ»  ·  40 лет на рынке", {
    x: ML, y: 4.55, w: 11, h: 0.45, fontFace: BF, fontSize: 15, color: STEEL, charSpacing: 1, margin: 0,
  });
  s.addText("gsk-tech.ru", {
    x: ML, y: 6.7, w: 5, h: 0.4, fontFace: HF, fontSize: 13, color: LIGHT, charSpacing: 1, margin: 0,
  });
})();

// ============================================================
// SLIDE 2 — О компании
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "О компании");
  s.addText(
    "Инжиниринговая компания полного цикла в промышленной водоподготовке и очистке сточных вод. Собственное производство, аттестованная лаборатория и проектный штат. Технологическое ядро — баромембранные технологии.",
    { x: ML, y: 1.7, w: 6.4, h: 2.4, fontFace: BF, fontSize: 17, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.3 });
  s.addText("Основана в 1985 году. В 2026-м вошла в состав Горно-строительной компании.", {
    x: ML, y: 4.5, w: 6.4, h: 1, fontFace: BF, fontSize: 14, italic: true, color: STEEL, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  // right ribbon: 4 stats
  const rx = 7.7, rw = 5.03;
  const cells = [["40", "лет на рынке"], ["5000", "внедрённых установок"], ["500", "сотрудников"], ["28 000 м²", "производственных площадей"]];
  card(s, rx, 1.6, rw, 5.0);
  let cy = 1.6, ch = 5.0 / 4;
  cells.forEach((c, i) => {
    s.addText(c[0], { x: rx + 0.35, y: cy + 0.12, w: rw - 0.7, h: ch * 0.55, fontFace: HF, fontSize: 34, bold: true, color: BLUE, valign: "bottom", margin: 0 });
    s.addText(c[1], { x: rx + 0.35, y: cy + ch * 0.62, w: rw - 0.7, h: ch * 0.32, fontFace: BF, fontSize: 13, color: STEEL, valign: "top", margin: 0 });
    if (i < 3) s.addShape(pres.ShapeType.line, { x: rx + 0.35, y: cy + ch, w: rw - 0.7, h: 0, line: { color: LIGHT, width: 1 } });
    cy += ch;
  });
  footer(s, 2);
})();

// ============================================================
// SLIDE 3 — В составе группы ГСК
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "В составе группы ГСК");
  const colW = 5.9, lx = ML, rx = ML + colW + 0.33, cy = 1.65, colH = 3.7;
  card(s, lx, cy, colW, colH); card(s, rx, cy, colW, colH);
  s.addText("ТЕХНОЛОГИИ ВОДЫ", { x: lx + 0.35, y: cy + 0.25, w: colW - 0.7, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: BLUE, charSpacing: 1, margin: 0 });
  s.addText("СТРОИТЕЛЬНАЯ ЧАСТЬ ГРУППЫ", { x: rx + 0.35, y: cy + 0.25, w: colW - 0.7, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: BLUE, charSpacing: 1, margin: 0 });
  bulletList(s, ["обследование и подбор технологии", "проектирование очистных сооружений", "производство оборудования", "монтаж и пусконаладка", "сервис и поставка расходников"], lx + 0.35, cy + 0.85, colW - 0.7, 2.7, { fontSize: 14, gap: 9 });
  bulletList(s, ["земляные работы и котлованы", "ограждения котлованов", "свайные основания", "подземные сооружения", "монолитные конструкции"], rx + 0.35, cy + 0.85, colW - 0.7, 2.7, { fontSize: 14, gap: 9 });
  // conclusion callout
  s.addShape(pres.ShapeType.rect, { x: ML, y: 5.65, w: CW, h: 0.95, fill: { color: BLUE } });
  s.addText("Один договор.   Один генподрядчик.   Одна ответственность за сроки.", {
    x: ML, y: 5.65, w: CW, h: 0.95, fontFace: HF, fontSize: 20, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 1, margin: 0 });
  footer(s, 3);
})();

// ============================================================
// SLIDE 4 — Полный цикл услуг
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Полный цикл услуг");
  const steps = ["Экологическое обследование", "Разработка технологических решений", "Проектирование очистных сооружений", "Производство оборудования", "Монтаж и пусконаладка", "Сервис и постгарантийное обслуживание"];
  const d = 1.25, y = 2.15;
  const startX = 0.75, gap = (CW - 6 * d) / 5 + d; // step
  for (let i = 0; i < 6; i++) {
    const cx = startX + i * (d + (CW - 6 * d) / 5);
    if (i < 5) {
      const nx = startX + (i + 1) * (d + (CW - 6 * d) / 5);
      s.addShape(pres.ShapeType.line, { x: cx + d, y: y + d / 2, w: nx - (cx + d), h: 0, line: { color: LIGHT, width: 1.5 } });
    }
    s.addShape(pres.ShapeType.ellipse, { x: cx, y, w: d, h: d, fill: { color: BLUE } });
    s.addText(String(i + 1), { x: cx, y, w: d, h: d, fontFace: HF, fontSize: 30, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(steps[i], { x: cx - 0.35, y: y + d + 0.15, w: d + 0.7, h: 1.4, fontFace: BF, fontSize: 12.5, color: DARK, align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.1 });
  }
  s.addText("От отбора пробы до сервиса — в одних руках.", {
    x: ML, y: 6.15, w: CW, h: 0.5, fontFace: BF, fontSize: 16, italic: true, color: STEEL, align: "center", margin: 0 });
  footer(s, 4);
})();

// ============================================================
// SLIDE 5 — Очистка сточных вод (photo right)
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Очистка сточных вод");
  s.addText("Разработка технологий и изготовление оборудования для очистки промышленных и хозяйственно-бытовых сточных вод.", {
    x: ML, y: 1.65, w: 6.4, h: 1.0, fontFace: BF, fontSize: 16, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  bulletList(s, ["горнодобывающий и обогатительный комплекс", "полигоны твёрдых коммунальных отходов", "гальванические производства", "металлургия, машиностроение, электроника", "предприятия ЖКХ", "пищевая промышленность", "транспортные предприятия, АЗС, нефтебазы"], ML, 2.85, 6.4, 3.7, { fontSize: 14, gap: 9 });
  photo(s, 7.5, 1.65, 5.23, 4.95, "Резервуарный парк /\nблочно-модульная станция очистки стоков");
  footer(s, 5);
})();

// ============================================================
// SLIDE 6 — Промышленная водоподготовка (photo left)
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Промышленная водоподготовка");
  photo(s, ML, 1.65, 5.23, 4.95, "Мембранный зал /\nблок обратного осмоса");
  const tx = 6.3;
  s.addText("Разработка технологий и производство оборудования для получения обессоленной воды для технологических процессов.", {
    x: tx, y: 1.65, w: 6.43, h: 1.0, fontFace: BF, fontSize: 16, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  bulletList(s, ["теплоэнергетика", "ликёро-водочное и безалкогольное производство", "фармацевтика и парфюмерия", "пищевая промышленность и металлургия", "электроника и микроэлектроника", "нефтегазовая отрасль", "химическая, стекольная, гальваника"], tx, 2.85, 6.43, 3.7, { fontSize: 14, gap: 9 });
  footer(s, 6);
})();

// ============================================================
// SLIDE 7 — Технологии
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Технологии");
  const methods = [
    ["Баромембранные", "обратный осмос, нанофильтрация, ультра- и микрофильтрация"],
    ["Реагентные", "коагуляция, флокуляция, нейтрализация, осаждение металлов"],
    ["Сорбционные и ионообменные", "доочистка, умягчение, извлечение ценных компонентов"],
    ["Биологические", "удаление органики и биогенных элементов"],
    ["Физические", "флотация, отстаивание, фильтрация"],
    ["Обработка осадка", "сгущение, обезвоживание на фильтр-прессе"],
  ];
  const cw = 3.84, chh = 1.45, gx = (CW - 3 * cw) / 2, gy = 0.2;
  for (let i = 0; i < 6; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const x = ML + col * (cw + gx), y = 1.55 + row * (chh + gy);
    card(s, x, y, cw, chh);
    s.addText(methods[i][0], { x: x + 0.25, y: y + 0.18, w: cw - 0.5, h: 0.45, fontFace: HF, fontSize: 14.5, bold: true, color: BLUE, margin: 0, valign: "top" });
    s.addText(methods[i][1], { x: x + 0.25, y: y + 0.66, w: cw - 0.5, h: 0.7, fontFace: BF, fontSize: 11.5, color: STEEL, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  }
  // chain strip
  const chain = ["сток", "предочистка", "мембранный блок", "доочистка", "обработка осадка", "очищенная вода"];
  const y2 = 4.95, bw = 1.78, bh = 0.55, gap2 = (CW - 6 * bw) / 5;
  for (let i = 0; i < 6; i++) {
    const x = ML + i * (bw + gap2);
    const emph = i === 2;
    s.addShape(pres.ShapeType.rect, { x, y: y2, w: bw, h: bh, fill: { color: emph ? BLUE : BG }, line: { color: emph ? BLUE : LIGHT, width: 1 } });
    s.addText(chain[i], { x, y: y2, w: bw, h: bh, fontFace: BF, fontSize: 11, bold: emph, color: emph ? WHITE : DARK, align: "center", valign: "middle", margin: 0 });
    if (i < 5) s.addText("›", { x: x + bw, y: y2, w: gap2, h: bh, fontFace: HF, fontSize: 16, color: STEEL, align: "center", valign: "middle", margin: 0 });
  }
  s.addText("Технологическое ядро — баромембранное разделение под давлением.", {
    x: ML, y: 5.75, w: CW, h: 0.5, fontFace: BF, fontSize: 14, italic: true, color: STEEL, align: "center", margin: 0 });
  footer(s, 7);
})();

// ============================================================
// SLIDE 8 — НИОКР
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "НИОКР");
  s.addText("Технология разрабатывается под конкретный сток, а не подбирается по каталогу. Выполнены сотни исследовательских работ, стендовых и пилотных испытаний, доведённых до аппаратурного оформления на площадках заказчиков.", {
    x: ML, y: 1.65, w: 6.4, h: 2.0, fontFace: BF, fontSize: 16, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.3 });
  bulletList(s, ["фундаментальные и прикладные исследования", "апробирование технологий", "стендовые и пилотные испытания", "внедрение и серийное оформление"], ML, 3.9, 6.4, 2.5, { fontSize: 15, gap: 11 });
  photo(s, 7.5, 1.65, 5.23, 4.95, "Лаборатория и пилотная установка\nна площадке заказчика");
  footer(s, 8);
})();

// ============================================================
// SLIDE 9 — Лаборатория
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Лаборатория");
  photo(s, ML, 1.65, 5.4, 4.95, "Аналитическая лаборатория:\nработа с пробами, титрование");
  const tx = 6.45, tw = 6.28;
  s.addText("Аттестованная аналитическая лаборатория. Анализ пробы заказчика проводится до заключения договора — технология подбирается по фактическому составу воды.", {
    x: tx, y: 1.65, w: tw, h: 1.6, fontFace: BF, fontSize: 16, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.3 });
  // two badges
  card(s, tx, 3.5, tw, 1.35);
  s.addText("80+", { x: tx + 0.3, y: 3.5, w: 2.0, h: 1.35, fontFace: HF, fontSize: 46, bold: true, color: BLUE, valign: "middle", margin: 0 });
  s.addText("показателей химического анализа", { x: tx + 2.4, y: 3.5, w: tw - 2.7, h: 1.35, fontFace: BF, fontSize: 15, color: DARK, valign: "middle", margin: 0 });
  card(s, tx, 5.05, tw, 1.35);
  s.addText("Аттестат аккредитации", { x: tx + 0.3, y: 5.05, w: tw - 0.6, h: 0.55, fontFace: HF, fontSize: 16, bold: true, color: BLUE, valign: "middle", margin: 0 });
  s.addText("номер и срок действия — актуальные на дату выпуска (вписать)", { x: tx + 0.3, y: 5.6, w: tw - 0.6, h: 0.7, fontFace: BF, fontSize: 13, italic: true, color: STEEL, valign: "top", margin: 0 });
  footer(s, 9);
})();

// ============================================================
// SLIDE 10 — Проектирование
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Проектирование");
  s.addText("Проектная документация по составу, установленному Постановлением Правительства № 87. Собственный проектный штат, опыт прохождения государственных экспертиз.", {
    x: ML, y: 1.6, w: 7.0, h: 1.3, fontFace: BF, fontSize: 15, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  bulletList(s, ["технологические и архитектурно-строительные решения, инженерные сети", "мероприятия по охране окружающей среды, сметная документация", "членство в СРО на проектные, строительно-монтажные и изыскательские работы", "ГИПы в Национальном реестре специалистов", "опыт главгосэкспертизы и государственной экологической экспертизы"], ML, 2.95, 7.0, 2.9, { fontSize: 13.5, gap: 9 });
  photo(s, 7.9, 1.6, 4.83, 3.05, "Проектный отдел:\nчертежи, 3D-модель очистных");
  // 3 SRO plashки
  const labels = ["СРО · Проектирование", "СРО · СМР", "СРО · Изыскания"];
  const pw = 3.84, pgap = (CW - 3 * pw) / 2, py = 5.9, ph2 = 0.85;
  labels.forEach((l, i) => {
    const x = ML + i * (pw + pgap);
    card(s, x, py, pw, ph2);
    s.addText(l, { x, y: py, w: pw, h: ph2, fontFace: HF, fontSize: 14, bold: true, color: BLUE, align: "center", valign: "middle", margin: 0 });
  });
  footer(s, 10);
})();

// ============================================================
// SLIDE 11 — Производство
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Производство");
  s.addText("Собственные цеха. Оборудование изготавливается, а не перепродаётся. Система менеджмента качества ISO 9001.", {
    x: ML, y: 1.6, w: 6.1, h: 1.0, fontFace: BF, fontSize: 15, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  // two stats inline
  stat(s, ML, 2.75, 3.0, "28 000 м²", "производственных площадей", { ns: 30, nh: 0.6, ls: 12 });
  stat(s, ML + 3.1, 2.75, 3.0, "2000+", "единиц серийного оборудования в год", { ns: 30, nh: 0.6, ls: 12 });
  bulletList(s, ["блочно-модульные установки", "ёмкостное оборудование", "фильтры и мембранные блоки", "системы дозирования", "шкафы автоматики", "готовые изделия на отгрузке"], ML, 4.35, 6.1, 2.4, { fontSize: 14, gap: 7 });
  // 2x2 photo grid right
  const gx = 6.95, gy = 1.6, pw = 2.83, ph2 = 2.45, ggap = 0.13;
  const caps = ["Цех сборки", "Ёмкостное оборудование", "Мембранный блок", "Шкаф автоматики"];
  for (let i = 0; i < 4; i++) {
    const c = i % 2, r = Math.floor(i / 2);
    photo(s, gx + c * (pw + ggap), gy + r * (ph2 + ggap), pw, ph2, caps[i]);
  }
  footer(s, 11);
})();

// ============================================================
// SLIDE 12 — Монтаж, пусконаладка, сервис
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Монтаж, пусконаладка, сервис");
  s.addText("После отгрузки заказчик не остаётся один. Оборудование выводится на проектные показатели, персонал заказчика обучается, поставляются мембраны и реагенты.", {
    x: ML, y: 1.65, w: 6.4, h: 1.6, fontFace: BF, fontSize: 16, color: DARK, valign: "top", margin: 0, lineSpacingMultiple: 1.3 });
  bulletList(s, ["СМР и шеф-монтаж", "пусконаладка и вывод на проектные показатели", "обучение персонала заказчика", "регламентное обслуживание", "поставка мембран, загрузок и реагентов"], ML, 3.4, 6.4, 3.0, { fontSize: 15, gap: 11 });
  photo(s, 7.5, 1.65, 5.23, 2.4, "Монтаж оборудования на объекте");
  photo(s, 7.5, 4.2, 5.23, 2.4, "Щит управления / шкаф автоматики");
  footer(s, 12);
})();

// ============================================================
// SLIDE 13 — Сотрудничество и наука
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Сотрудничество и наука");
  const colW = 5.9, lx = ML, rx = ML + colW + 0.33;
  photo(s, lx, 1.65, colW, 2.1, "Профильный вуз / совместная лаборатория");
  photo(s, rx, 1.65, colW, 2.1, "Природный объект нацпроекта «Экология»");
  s.addText("ВУЗЫ", { x: lx, y: 3.95, w: colW, h: 0.4, fontFace: HF, fontSize: 14, bold: true, color: BLUE, charSpacing: 1, margin: 0 });
  s.addText("НАЦИОНАЛЬНЫЕ ПРОЕКТЫ", { x: rx, y: 3.95, w: colW, h: 0.4, fontFace: HF, fontSize: 14, bold: true, color: BLUE, charSpacing: 1, margin: 0 });
  bulletList(s, ["РХТУ им. Д.И. Менделеева", "МФТИ", "Московский политехнический университет", "ИГХТУ", "ВлГУ им. Столетовых"], lx, 4.4, colW, 2.2, { fontSize: 14, gap: 8 });
  bulletList(s, ["«Экология» (программа «Чистая страна»)", "«Наука и университеты»", "совместные НИОКР, практика и обучение студентов"], rx, 4.4, colW, 2.2, { fontSize: 14, gap: 8 });
  footer(s, 13);
})();

// ============================================================
// SLIDE 14 — География поставок
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "География поставок");
  photo(s, ML, 1.65, 7.6, 4.95, "Карта России: города поставок —\nНорильск · Байкальск · Североуральск · Емва ·\nИркутск · Тула · Волгоградская обл. · Ленинградская обл.");
  const rx = 8.5, rw = 4.23;
  const stats = [["50+", "объектов очистки стоков в год"], ["20+", "объектов водоподготовки в год"], ["2000+", "единиц серийного оборудования в год"]];
  let y = 1.65; const hh = 1.6;
  stats.forEach((st, i) => {
    s.addText(st[0], { x: rx, y: y + 0.05, w: rw, h: 0.85, fontFace: HF, fontSize: 44, bold: true, color: BLUE, valign: "bottom", margin: 0 });
    s.addText(st[1], { x: rx, y: y + 0.95, w: rw, h: 0.5, fontFace: BF, fontSize: 13.5, color: STEEL, valign: "top", margin: 0 });
    if (i < 2) s.addShape(pres.ShapeType.line, { x: rx, y: y + hh - 0.05, w: rw, h: 0, line: { color: LIGHT, width: 1 } });
    y += hh;
  });
  footer(s, 14);
})();

// ============================================================
// SLIDE 15 — Разрешительные документы
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Разрешительные документы");
  const docs = ["Декларация ТР ТС ЕАЭС", "ISO 9001 — менеджмент качества", "ISO 14001 — экологический менеджмент", "Сертификаты на продукцию", "Выписки СРО (проект., СМР, изыскания)", "Аттестат аккредитации лаборатории"];
  const cw = 3.84, chh = 1.9, gx = (CW - 3 * cw) / 2, gy = 0.25;
  for (let i = 0; i < 6; i++) {
    const c = i % 3, r = Math.floor(i / 3);
    const x = ML + c * (cw + gx), y = 1.6 + r * (chh + gy);
    s.addShape(pres.ShapeType.rect, { x, y, w: cw, h: chh, fill: { color: WHITE }, line: { color: LIGHT, width: 1 } });
    // mini scan block
    s.addShape(pres.ShapeType.rect, { x: x + 0.3, y: y + 0.25, w: 1.1, h: 1.4, fill: { color: BG }, line: { color: LIGHT, width: 1 } });
    s.addText("DOC", { x: x + 0.3, y: y + 0.25, w: 1.1, h: 1.4, fontFace: HF, fontSize: 11, color: STEEL, align: "center", valign: "middle", margin: 0 });
    s.addText(docs[i], { x: x + 1.55, y: y + 0.25, w: cw - 1.8, h: 1.4, fontFace: BF, fontSize: 13, bold: true, color: DARK, valign: "middle", margin: 0, lineSpacingMultiple: 1.15 });
  }
  s.addText("Документы переоформляются на новое наименование; до завершения действуют в текущем виде под брендом «ГСК технологии (ранее ООО «БМТ»)».", {
    x: ML, y: 6.35, w: CW, h: 0.5, fontFace: BF, fontSize: 12, italic: true, color: STEEL, margin: 0, valign: "top" });
  footer(s, 15);
})();

// ============================================================
// SLIDES 16–24 — Projects (unified card template)
// ============================================================
const projects = [
  { seg: "Промышленные отходы", client: "ООО «Красный Бор»", type: "ОПИ, подбор технологии, ПД и РД, главгосэкспертиза и ГЭЭ", perf: "60 и 220 м³/ч, очистка по 110 показателям", place: "Ленинградская область", year: "2021–2022", key: "110", keyl: "показателей очистки", photo: "Станция очистки промышленных отходов" },
  { seg: "Промышленные отходы", client: "АО «Байкальский ЦБК»", type: "ОПИ, технология, ПД и РД, экспертизы, поставка, ввод", perf: "30 и 100 м³/ч, 32 показателя", place: "Байкальск", year: "2021–2024", key: "32", keyl: "показателя очистки", photo: "Очистные сооружения, Байкальск" },
  { seg: "ГОК", client: "ОАО «Уралмеханобр» · рудник «Октябрьский»", type: "НИР, ПД и РД, сопровождение госэкспертизы", perf: "2400 м³/ч", place: "Норильск", year: "2024", key: "2400", keyl: "м³/ч", photo: "Объект рудника «Октябрьский»" },
  { seg: "ГОК", client: "АО «Боксит Тимана»", type: "ПД, поставка оборудования и реагентов, ПНР; карьерные воды", perf: "2500 м³/ч", place: "Республика Коми, Емва", year: "2017–2019", key: "2500", keyl: "м³/ч", photo: "Очистка карьерных вод" },
  { seg: "Шахтные воды", client: "АО «СУБР» · шахта «Черемуховская»", type: "ПД и реконструкция очистных сооружений шахты", perf: "рост с 800 до 3000 м³/ч", place: "Североуральск", year: "2017–2020", key: "800→3000", keyl: "м³/ч", photo: "Реконструированные очистные шахты" },
  { seg: "ГОК", client: "ПАО «ГМК «Норильский никель»", type: "Очистка шахтных вод рудника «Ангидрит» и карьерных вод карьера «Кайерканский»", perf: "170 и 1000 м³/ч", place: "Норильск", year: "2016–2018", key: "1000", keyl: "м³/ч (карьерные воды)", photo: "Объекты Норильского района" },
  { seg: "Химия", client: "ООО «Иркутская химическая компания»", type: "Технология получения карбоната лития из гидроминерального сырья, ПД и РД, поставка", perf: "53 м³/ч", place: "Иркутск", year: "с 2023", key: "Li₂CO₃", keyl: "карбонат лития", photo: "Установка получения карбоната лития" },
  { seg: "Гальваника", client: "АО «Щегловский вал»", type: "ПД, поставка, ПНР; замкнутый водооборот", perf: "3,5 м³/ч", place: "Тула", year: "2014", key: "0", keyl: "сброс — замкнутый водооборот", photo: "Компактная установка в цехе" },
  { seg: "Водоподготовка", client: "ООО «НьюБио»", type: "Установка водоподготовки для глубокой переработки зерна кукурузы", perf: "100 м³/ч", place: "Волгоградская область", year: "2019", key: "100", keyl: "м³/ч", photo: "Установка водоподготовки" },
];
projects.forEach((p, idx) => {
  const s = pres.addSlide();
  segment(s, "Проекты / " + p.seg);
  const long = p.client.length > 26;
  title(s, p.client, { y: 0.62, size: long ? 24 : 28, h: 1.0 });
  const lx = ML, lw = 6.9;
  const rows = [["Тип работ", p.type], ["Производительность", p.perf], ["Место", p.place], ["Год реализации", p.year]];
  let y = 1.95;
  rows.forEach((r) => {
    s.addText(r[0].toUpperCase(), { x: lx, y, w: lw, h: 0.3, fontFace: HF, fontSize: 11, bold: true, color: STEEL, charSpacing: 1, margin: 0, valign: "top" });
    s.addText(r[1], { x: lx, y: y + 0.32, w: lw, h: 0.75, fontFace: BF, fontSize: 15, color: DARK, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
    const lines = r[1].length > 48 ? 2 : 1;
    y += 0.32 + (lines === 2 ? 0.85 : 0.55);
    s.addShape(pres.ShapeType.line, { x: lx, y: y - 0.12, w: lw, h: 0, line: { color: LIGHT, width: 1 } });
  });
  // key figure callout
  card(s, lx, 5.75, lw, 0.95);
  s.addText(p.key, { x: lx + 0.3, y: 5.75, w: lw * 0.55, h: 0.95, fontFace: HF, fontSize: 34, bold: true, color: BLUE, valign: "middle", margin: 0 });
  s.addText(p.keyl, { x: lx + lw * 0.5, y: 5.75, w: lw * 0.5 - 0.3, h: 0.95, fontFace: BF, fontSize: 13, color: STEEL, valign: "middle", align: "right", margin: 0 });
  // photo right
  photo(s, 7.9, 1.95, 4.83, 4.75, p.photo);
  footer(s, 16 + idx);
});

// ============================================================
// SLIDE 25 — Нам доверяют
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Нам доверяют");
  const logos = ["Норникель", "Ростех", "РЖД", "СИБУР", "Роскосмос", "Росатом", "ЛУКОЙЛ", "СУЭК", "Татнефть", "Иркутская нефтяная компания", "ОАК", "Мосэнерго", "холдинг «Титан»", "Яндекс"];
  const cols = 5, rows = 3;
  const cw = (CW - (cols - 1) * 0.2) / cols, chh = 1.5, gx = 0.2, gy = 0.2;
  logos.forEach((l, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = ML + c * (cw + gx), y = 1.75 + r * (chh + gy);
    s.addShape(pres.ShapeType.rect, { x, y, w: cw, h: chh, fill: { color: WHITE }, line: { color: LIGHT, width: 1 } });
    s.addText(l, { x: x + 0.1, y, w: cw - 0.2, h: chh, fontFace: HF, fontSize: 13, bold: true, color: BLUE, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
  });
  s.addText("По каждому логотипу — договор и согласие на упоминание.", {
    x: ML, y: 6.85, w: CW, h: 0.3, fontFace: BF, fontSize: 11, italic: true, color: STEEL, align: "left", margin: 0 });
  footer(s, 25);
})();

// ============================================================
// SLIDE 26 — Как начать работу
// ============================================================
(() => {
  const s = pres.addSlide();
  title(s, "Как начать работу");
  const steps = [
    ["01", "Вы присылаете протокол анализа воды и требуемые показатели на выходе"],
    ["02", "Мы возвращаемся с технологической схемой и предварительной оценкой стоимости"],
    ["03", "При необходимости проводим опытно-промышленные испытания на вашей площадке"],
  ];
  const cw = 3.84, gx = (CW - 3 * cw) / 2, y = 2.0, chh = 3.3;
  steps.forEach((st, i) => {
    const x = ML + i * (cw + gx);
    card(s, x, y, cw, chh);
    s.addText(st[0], { x: x + 0.3, y: y + 0.3, w: cw - 0.6, h: 1.0, fontFace: HF, fontSize: 44, bold: true, color: BLUE, margin: 0, valign: "top" });
    s.addText(st[1], { x: x + 0.3, y: y + 1.45, w: cw - 0.6, h: 1.6, fontFace: BF, fontSize: 15, color: DARK, margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
    if (i < 2) s.addText("›", { x: x + cw, y, w: gx, h: chh, fontFace: HF, fontSize: 28, color: STEEL, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("Срок ответа — согласованный с коммерческим отделом (вписать в рабочих днях).", {
    x: ML, y: 5.7, w: CW, h: 0.5, fontFace: BF, fontSize: 14, italic: true, color: STEEL, align: "center", margin: 0 });
  footer(s, 26);
})();

// ============================================================
// SLIDE 27 — Контакты
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: BLUE };
  s.addText("КОНТАКТЫ", { x: ML, y: 0.42, w: CW, h: 0.8, fontFace: HF, fontSize: 30, bold: true, color: WHITE, charSpacing: 1, margin: 0, valign: "middle" });
  const rows = [
    ["ООО «ГСК технологии»", "ранее ООО «БМТ»"],
    ["Производственная площадка", "г. Владимир"],
    ["Сайт", "gsk-tech.ru"],
    ["Почта", "info@gsk-tech.ru"],
    ["Телефон", "+7 …"],
  ];
  let y = 2.0;
  rows.forEach((r) => {
    s.addText(r[0].toUpperCase(), { x: ML, y, w: 7, h: 0.3, fontFace: HF, fontSize: 11, bold: true, color: STEEL, charSpacing: 1, margin: 0 });
    s.addText(r[1], { x: ML, y: y + 0.3, w: 7, h: 0.5, fontFace: BF, fontSize: 20, color: WHITE, margin: 0, valign: "top" });
    y += 0.95;
  });
  // QR placeholder
  s.addShape(pres.ShapeType.rect, { x: 9.4, y: 2.0, w: 2.8, h: 2.8, fill: { color: WHITE } });
  s.addText("QR", { x: 9.4, y: 2.0, w: 2.8, h: 2.8, fontFace: HF, fontSize: 22, bold: true, color: BLUE, align: "center", valign: "middle", margin: 0 });
  s.addText("на сайт компании", { x: 9.4, y: 4.85, w: 2.8, h: 0.4, fontFace: BF, fontSize: 12, color: LIGHT, align: "center", margin: 0 });
})();

pres.writeFile({ fileName: "/home/user/123/gsk-tehnologii.pptx" }).then((f) => console.log("Saved:", f));

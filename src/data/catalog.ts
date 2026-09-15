// GENERATED from the Claude Design catalog (الكتالوج.dc.html).
// The design labels this data تجريبية (demo) — swap in real products and prices.

export type Availability = 'متوفر' | 'تحت الطلب';

/**
 * One orderable size of a product that comes in several.
 *
 * Each variant carries its own full SKU code rather than a suffix composed at
 * runtime, for two reasons: the cart keys lines by code, so distinct codes keep
 * A4 and A3 of the same product as separate lines for free; and the order
 * message degrades to code-only under the URL budget (see order.ts), where the
 * code is the only thing left to say which size was ordered.
 */
export interface ProductVariant {
  code: string;
  size: string;
}

export interface Product {
  /** Stable id used as the cart key. Variant products key by variant code. */
  code: string;
  name: string;
  /** Ignored when `variants` is set — the chosen variant supplies the size. */
  size: string;
  unit: string;
  /** Used for sorting only — not shown, and never sent with the order. */
  price: number;
  inStock: boolean;
  availability: Availability;
  image: string | null;
  imageAlt: string | null;
  /** Set when the product is sold in several sizes. The card shows a picker. */
  variants?: ProductVariant[];
}

export interface CatalogSection {
  id: string;
  title: string;
  blurb: string;
  products: Product[];
}

export const catalog: CatalogSection[] = [
  {
    id: "copy",
    title: "ورق التصوير",
    blurb: "ورق A4 وA3 وA5 بأوزان مختلفة، للطابعات وماكينات التصوير. كله متوفر بالكرتونة أو بالريم.",
    products: [
      {
        code: "SBR-CP-A480",
        name: "Multi-Office A4 — 80 جرام",
        size: "210 × 297 مم",
        unit: "كرتونة — 5 رزم × 500 ورقة",
        price: 1180,
        inStock: true,
        availability: "متوفر",
        image: "/assets/paper-multi-office-a4-80.jpg",
        imageAlt: "كرتونة ورق Multi Office مقاس A4 وزن 80 جرام",
      },
      {
        code: "SBR-CP-A470",
        name: "Multi-Office A3 — 80 جرام",
        size: "210 × 297 مم",
        unit: "كرتونة — 5 رزم × 500 ورقة",
        price: 1040,
        inStock: true,
        availability: "متوفر",
        image: "/assets/paper-multi-office-a3-80.jpg",
        imageAlt: "كرتونة ورق Multi Office مقاس A3 وزن 80 جرام",
      },
      {
        code: "SBR-CP-A380",
        name: "شيمكس A3 — 80 جرام",
        size: "297 × 420 مم",
        unit: "كرتونة — 5 رزم × 500 ورقة",
        price: 2290,
        inStock: true,
        availability: "متوفر",
        image: "/assets/paper-chamex-80.jpg",
        imageAlt: "كرتونة ورق شيمكس وزن 80 جرام",
      },
      {
        code: "SBR-CP-A4CL",
        name: "أمنية 80 جرام",
        size: "210 × 297 مم — 80 جرام",
        unit: "رزمة — 100 ورقة",
        price: 165,
        inStock: true,
        availability: "متوفر",
        image: "/assets/paper-omnia-80.jpg",
        imageAlt: "كرتونة ورق أمنية وزن 80 جرام",
      },
      {
        code: "SBR-CP-A580",
        name: "أزهار 70 جرام",
        size: "148 × 210 مم",
        unit: "كرتونة — 10 رزم × 500 ورقة",
        price: 1320,
        inStock: true,
        availability: "متوفر",
        image: "/assets/paper-azhar-70.jpg",
        imageAlt: "رزمة ورق أزهار وزن 70 جرام",
      },
      {
        code: "SBR-CP-A4100",
        name: "مرام 70 جرام",
        size: "210 × 297 مم",
        unit: "رزمة — 500 ورقة",
        price: 320,
        inStock: false,
        availability: "تحت الطلب",
        image: "/assets/paper-maram-70.jpg",
        imageAlt: "رزم ورق مرام وزن 70 جرام",
      },
    ],
  },
  {
    id: "office",
    title: "الأدوات المكتبية",
    blurb: "اللي المكتب بيستهلكه كل شهر: أدوات كتابة وتنظيم وتدبيس، بتوريد منتظم.",
    products: [
      {
        code: "SBR-OF-STP",
        name: "دباسة كانجارو FL-B9",
        size: "دبوس 24/6 و 26/6",
        unit: "قطعة",
        price: 145,
        inStock: true,
        availability: "متوفر",
        image: "/assets/office-stapler-kangaro-flb9.jpg",
        imageAlt: "دباسة مكتب ماركة كانجارو موديل FL-B9",
      },
      {
        code: "SBR-OF-HLT",
        name: "قلم تحديد ROTO Bright",
        size: "سن مشطوف 2 – 5 مم",
        unit: "علبة — 4 ألوان",
        price: 120,
        inStock: true,
        availability: "متوفر",
        image: "/assets/office-highlighter-roto-bright.jpg",
        imageAlt: "أربعة أقلام تحديد ROTO Bright بألوان بمبي وأصفر وبرتقالي وأخضر",
      },
      {
        code: "SBR-OF-STN",
        name: "ورق ملاحظات لاصق نيون",
        size: "76 × 127 مم",
        unit: "باكو — 4 بلوكات",
        price: 95,
        inStock: true,
        availability: "متوفر",
        image: "/assets/office-sticky-notes-neon.jpg",
        imageAlt: "أربعة بلوكات ورق ملاحظات لاصق بألوان نيون",
      },
      {
        code: "SBR-OF-IDX",
        name: "علامات صفحات لاصقة Stick'n",
        size: "أسهم 12 × 45 مم",
        unit: "باكو — 5 ألوان × 20 علامة",
        price: 70,
        inStock: true,
        availability: "متوفر",
        image: "/assets/office-index-tabs-stickn.jpg",
        imageAlt: "علامات صفحات لاصقة على شكل أسهم بخمسة ألوان",
      },
    ],
  },
  {
    id: "filing",
    title: "حفظ وتنظيم الملفات",
    blurb: "كلاسيرات وبوكسات وجيوب وتكعيب، لأرشيف المكتب اللي محتاج يفضل مرتب.",
    products: [
      {
        code: "SBR-FL-BND",
        name: "تكعيب معتم وشفاف",
        size: "A4",
        unit: "باكو — 100 ورقة",
        price: 240,
        inStock: true,
        availability: "متوفر",
        image: "/assets/binding-covers-opaque-clear.jpg",
        imageAlt: "أغلفة تكعيب معتمة وشفافة بألوان أبيض وبرتقالي وأخضر وبمبي",
        variants: [
          { code: "SBR-FL-BND-A4", size: "A4" },
          { code: "SBR-FL-BND-A3", size: "A3" },
        ],
      },
      {
        code: "SBR-FL-LAF",
        name: "كلاسير رمسيس أسود",
        size: "A4 — كعب 8 سم",
        unit: "قطعة",
        price: 150,
        inStock: true,
        availability: "متوفر",
        image: "/assets/filing-lever-arch-ramsis-black.jpg",
        imageAlt: "كلاسير ماركة رمسيس أسود مقاس A4",
      },
      {
        code: "SBR-FL-BOX",
        name: "بوكس ملفات ساسكو أزرق",
        size: "A4 — كعب 8 سم",
        unit: "قطعة",
        price: 165,
        inStock: true,
        availability: "متوفر",
        image: "/assets/filing-box-file-sasco-blue.jpg",
        imageAlt: "بوكس ملفات ماركة ساسكو أزرق بقفل كبسولة",
      },
      {
        code: "SBR-FL-SHP",
        name: "جيب شفاف مثقب",
        size: "A4",
        unit: "باكو — 100 جيب",
        price: 130,
        inStock: true,
        availability: "متوفر",
        image: "/assets/filing-sheet-protector-a4.jpg",
        imageAlt: "جيب بلاستيك شفاف مثقب مقاس A4",
      },
    ],
  },
  {
    id: "paper",
    title: "الورقيات",
    blurb: "فوط ومناديل ورق بكميات الشركات والمطاعم والجهات.",
    products: [
      {
        code: "SBR-PG-HTW",
        name: "فوطة أيدي انترفولد ITALY",
        size: "طي انترفولد — طبقة واحدة",
        unit: "كرتونة — 20 باكو",
        price: 610,
        inStock: true,
        availability: "متوفر",
        image: "/assets/paper-hand-towel-interfold.jpg",
        imageAlt: "باكو فوطة أيدي انترفولد ماركة ITALY",
      },
    ],
  },
  {
    id: "cleaning",
    title: "مستلزمات النظافة",
    blurb: "أكياس القمامة ومستلزمات النظافة اليومية، بكميات الشركات والمنشآت.",
    products: [
      {
        code: "SBR-CL-BAG",
        name: "أكياس قمامة سوداء",
        size: "70 × 90 سم",
        unit: "رول — 10 أكياس",
        price: 95,
        inStock: true,
        availability: "متوفر",
        image: "/assets/cleaning-bin-liner-black-roll.jpg",
        imageAlt: "رول أكياس قمامة سوداء",
      },
    ],
  },
  {
    id: "pantry",
    title: "البوفيه",
    blurb: "مستلزمات البوفيه والضيافة، بتوريد شهري ثابت على حساب استهلاك مكتبك.",
    products: [
      {
        code: "SBR-PA-YEM",
        name: "بن اليمني عبد المعبود — سادة فاتح",
        size: "علبة 200 جرام",
        unit: "كرتونة — 24 علبة",
        price: 1680,
        inStock: true,
        availability: "متوفر",
        image: "/assets/pantry-coffee-alyemeni.jpg",
        imageAlt: "علبة بن اليمني عبد المعبود سادة محمص فاتح",
      },
      {
        code: "SBR-PA-UHT",
        name: "لبن المراعي طويل الأجل — كامل الدسم",
        size: "زجاجة 1 لتر",
        unit: "كرتونة — 12 زجاجة",
        price: 720,
        inStock: true,
        availability: "متوفر",
        image: "/assets/pantry-milk-almarai-longlife-1l.jpg",
        imageAlt: "زجاجة لبن المراعي طويل الأجل كامل الدسم 1 لتر",
      },
    ],
  },
  {
    id: "equipment",
    title: "الأجهزة والتجهيزات",
    blurb: "تجهيزات المقر اللي بتتشترى مرة وتفضل: أجهزة وسبورات، بالتوصيل والتركيب.",
    products: [
      {
        code: "SBR-EQ-WBD",
        name: "سبورة بيضاء بحامل متحرك",
        size: "120 × 90 سم",
        unit: "قطعة",
        price: 3200,
        inStock: true,
        availability: "متوفر",
        image: "/assets/equipment-whiteboard-mobile.jpg",
        imageAlt: "سبورة بيضاء على حامل متحرك بعجل",
        variants: [
          { code: "SBR-EQ-WBD-1290", size: "120 × 90 سم" },
          { code: "SBR-EQ-WBD-150100", size: "150 × 100 سم" },
        ],
      },
      {
        code: "SBR-EQ-FRG",
        name: "ثلاجة يونيون آير — أسود",
        size: "16 قدم — باب علوي",
        unit: "قطعة",
        price: 28000,
        inStock: false,
        availability: "تحت الطلب",
        image: "/assets/equipment-fridge-unionaire-black.jpg",
        imageAlt: "ثلاجة يونيون آير سوداء بباب علوي للفريزر",
      },
    ],
  },

];

export const totalProducts = catalog.reduce((n, s) => n + s.products.length, 0);

export const site = {
  name: 'الصبر',
  tagline: 'لتوريد مستلزمات الشركات',
  phoneDisplay: '0103 288 2388',
  phoneHref: 'tel:+201032882388',
  // Click-to-chat wants international format, digits only — no '+', spaces or
  // separators. isWhatsappConfigured() in cart/order.ts enforces that shape.
  whatsapp: '201032882388',
  email: 'sales@example.com',
  city: 'القاهرة',
  serviceAreas: 'القاهرة، الجيزة، 6 أكتوبر، العبور',
  hours: { from: '9 ص', to: '6 م' },
} as const;

export const nav = [
  { label: 'الكتالوج', href: '/catalog', kind: 'route' },
  { label: 'ليه الصبر', href: '#why', kind: 'anchor' },
  { label: 'إزاي بنشتغل', href: '#how', kind: 'anchor' },
  { label: 'بنحل إيه', href: '#problems', kind: 'anchor' },
  { label: 'مين إحنا', href: '#team', kind: 'anchor' },
] as const;

export type Availability = 'متوفر' | 'بالطلب';

export interface CategoryLine {
  item: string;
  unit: string;
}

export interface Category {
  no: string;
  title: string;
  blurb: string;
  availability: Availability;
  lines: CategoryLine[];
}

export const categories: Category[] = [
  {
    no: '01',
    title: 'ورق التصوير',
    blurb: 'A4 وA3 بأوزان مختلفة، للمكاتب والمدارس والمستشفيات.',
    availability: 'متوفر',
    lines: [
      { item: 'A4 — 80 جرام', unit: 'كرتونة 5 رزم' },
      { item: 'A4 — 70 جرام', unit: 'كرتونة 5 رزم' },
      { item: 'A3 — 80 جرام', unit: 'بالريم أو الكرتونة' },
      { item: 'ورق ملون', unit: 'رزمة 100 ورقة' },
    ],
  },
  {
    no: '02',
    title: 'الأدوات المكتبية',
    blurb: 'كل اللي المكتب محتاجه في شغله اليومي.',
    availability: 'متوفر',
    lines: [
      { item: 'أقلام جاف وسنون', unit: 'بالعلبة' },
      { item: 'دباسات وخرامات', unit: 'مقاسات مختلفة' },
      { item: 'ملفات وحوافظ', unit: 'بالكرتونة' },
      { item: 'شرايط لاصقة ومساطر', unit: 'بالعلبة' },
    ],
  },
  {
    no: '03',
    title: 'الورقيات',
    blurb: 'مستلزمات الورق للاستخدام اليومي، بكميات الشركات.',
    availability: 'متوفر',
    lines: [
      { item: 'مناديل وفوط ورق', unit: 'بالكرتونة' },
      { item: 'أكواب وأطباق ورق', unit: 'بالكرتونة' },
      { item: 'أكياس وعلب تغليف', unit: 'مقاسات مختلفة' },
      { item: 'ورق طباعة حرارية', unit: 'رولات' },
    ],
  },
  {
    no: '04',
    title: 'الطباعة',
    blurb: 'أعمال الطباعة للشركات: مطبوعات إدارية ونماذج ومستلزمات الهوية.',
    availability: 'بالطلب',
    lines: [
      { item: 'مطبوعات إدارية', unit: 'حسب التصميم' },
      { item: 'نماذج وفواتير', unit: 'بالبلوك' },
      { item: 'كروت وأوراق رسمية', unit: 'بالكمية' },
      { item: 'لافتات وبانرات', unit: 'بالمقاس' },
    ],
  },
  {
    no: '05',
    title: 'البوفيه',
    blurb: 'مستلزمات البوفيه والضيافة، بتوريد شهري منتظم.',
    availability: 'متوفر',
    lines: [
      { item: 'شاي وقهوة', unit: 'بالكرتونة' },
      { item: 'سكر ولبن بودرة', unit: 'بالكرتونة' },
      { item: 'أكواب وملاعق', unit: 'بالباكو' },
      { item: 'مستلزمات ضيافة', unit: 'توريد شهري' },
    ],
  },
  {
    no: '06',
    title: 'المواد الغذائية',
    blurb: 'توريد المواد الغذائية للشركات والجهات.',
    availability: 'متوفر',
    lines: [
      { item: 'بقالة جافة', unit: 'بالكرتونة' },
      { item: 'زيوت ومعلبات', unit: 'بالكرتونة' },
      { item: 'مشروبات', unit: 'بالكرتونة' },
      { item: 'مستلزمات مطابخ', unit: 'بالكمية' },
    ],
  },
];

export const commitments = [
  {
    no: '01',
    title: 'مصداقية',
    body: 'اللي اتفقنا عليه هو اللي بيوصلك، بنفس الصنف والسعر. ولو حصل تغيير، بنقولك الأول.',
  },
  {
    no: '02',
    title: 'سرعة الشحن',
    body: 'يومين بس من الطلب لحد باب المخزن. ميعاد ثابت ومش بيتغير.',
  },
  {
    no: '03',
    title: 'توافر المنتج',
    body: 'عندنا رصيد أمان من الأصناف الأساسية دايمًا، عشان أوردرك ميستناش.',
  },
  {
    no: '04',
    title: 'سعر منافس',
    body: 'بنشتري بكميات كبيرة وبننزل السعر للعميل. وكل ما الكمية تكبر، السعر ينزل.',
  },
  {
    no: '05',
    title: 'متابعة ودعم',
    body: 'متخصص واحد بيتابع معاك بعد التسليم. وأي مشكلة، الاستبدال حق مضمون.',
  },
];

export const processSteps = [
  {
    no: '01',
    title: 'تقولنا محتاج إيه',
    body: 'الصنف والكمية الشهرية تقريبًا. لو مش متأكد، المتخصص يساعدك.',
  },
  {
    no: '02',
    title: 'يصلك عرض مكتوب',
    body: 'في نفس اليوم، بالسعر ومدة التسليم. ثابت لمدة 30 يوم.',
  },
  {
    no: '03',
    title: 'التسليم عندك',
    body: 'خلال يومين من تأكيد الطلب، لحد باب المخزن. والفاتورة توصلك مع التسليم.',
  },
  {
    no: '04',
    title: 'المتابعة بعد التسليم',
    body: 'مكالمة من المتخصص بعد أسبوع، نطمن ونحدد الأوردر الجاي.',
  },
];

export const problems = [
  {
    problem: '«الأوردر اتأخر ومحدش قالي، والشغل وقف.»',
    answer: 'ميعاد التسليم يومين، ولو في طارئ هتعرف قبل الميعاد.',
  },
  {
    problem: '«وصلت كمية أقل، أو صنف غير اللي اتفقنا عليه.»',
    answer: 'استبدال واسترجاع فورًا، من غير مفاوضات.',
  },
  {
    problem: '«كل مرة بكلم حد جديد وأشرح الموضوع من الأول.»',
    answer: 'متخصص واحد بالاسم والرقم، عارف كل حاجة عنك.',
  },
  {
    problem: '«الدفع والفواتير بياخدوا وقت ودوخة.»',
    answer: 'دفع سهل وفاتورة توصلك مع التسليم.',
  },
];

export const stats = [
  {
    value: '6',
    title: 'أقسام توريد',
    body: 'من الورق للبوفيه، مورّد واحد بدل خمسة.',
  },
  {
    value: '2',
    title: 'يوم للتسليم',
    body: 'من الطلب لحد باب المخزن.',
  },
  {
    value: '4',
    title: 'مناطق خدمة',
    body: 'القاهرة، الجيزة، 6 أكتوبر، العبور.',
  },
];

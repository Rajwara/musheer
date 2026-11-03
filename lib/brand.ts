/**
 * Al Musheer brand details and copy, adapted from the store's existing website.
 * Edit here to update the header, footer, home page, About, Branches and Contact.
 */

export const BRAND = "Al Musheer";
export const TAGLINE = "Kandura tailoring since 1998 · United Arab Emirates";

export const PHONE_DISPLAY = "+971 56 858 6987";
export const PHONE_TEL = "+971568586987";
export const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=971568586987";
export const whatsapp = (text: string) => `${WHATSAPP_URL}&text=${encodeURIComponent(text)}`;
export const HOME_VISIT_URL = whatsapp("Hello Al Musheer, I would like to book a home tailoring visit.");

export const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/almusheer", icon: "instagram" },
  { name: "TikTok", href: "https://www.tiktok.com/@al_musheer", icon: "tiktok" },
  { name: "WhatsApp", href: WHATSAPP_URL, icon: "whatsapp" },
] as const;

export const STATS = [
  { value: "1998", label: "Founded" },
  { value: "13", label: "Branches" },
  { value: "5", label: "Emirates" },
  { value: "40+", label: "Years of craft" },
];

export const HERO = {
  eyebrow: "Est. 1998 · United Arab Emirates",
  title: "The Art of the Kandura, Perfected.",
  text: "Since 1998, Al Musheer has dressed the men of the UAE in kanduras cut with precision and finished to a standard we have spent a generation refining. Today we are proud to be one of the UAE's leading names in kandura textile and tailoring.",
};

export const WHO_WE_ARE = {
  eyebrow: "Who we are",
  title: "Tailoring built on trust, not shortcuts.",
  paragraphs: [
    "Since 1998, Al Musheer has been dedicated to delivering exceptional service and building lasting relationships through personal attention to every client's needs. A seamless, customer-first approach, paired with expert craftsmanship, has earned us a trusted reputation across the UAE's tailoring industry.",
    "What began as a single store has grown into a name found in almost every emirate, while our focus has never moved from the fit, fabric and finish of every piece we make.",
  ],
  quote: "Precision in fit, honesty in fabric.",
};

export const STORY = {
  eyebrow: "Our story",
  title: "A family craft, grown into a national name.",
  steps: [
    {
      when: "1998",
      title: "A Tailor's Beginning",
      text: "A master tailor from a family of tailors opened Al Musheer's first store, bringing decades of craft to the men of the UAE.",
    },
    {
      when: "Growth",
      title: "Setting the Standard",
      text: "Word spread quickly. A commitment to the finest fabrics and meticulous stitching made Al Musheer a favourite in the local community.",
    },
    {
      when: "Today",
      title: "A Name Across the Emirates",
      text: "13 branches across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah, and one of the most recognised names in UAE tailoring.",
    },
  ],
};

export const SERVICES = {
  eyebrow: "What we offer",
  title: "Every detail, tailored on purpose.",
  items: [
    {
      title: "Bespoke Kanduras",
      text: "Precision-tailored kanduras made from the finest fabrics, blending traditional design with modern craftsmanship for a perfect fit.",
      href: "/category/kandura-thobes",
      image: "images/categories/kandura-thobes",
    },
    {
      title: "Army & Police Uniforms",
      text: "Trusted to outfit uniformed services, with uniforms held to the same exacting standard of precision as our kanduras.",
      href: "/contact",
      image: "images/categories/kandura-jackets",
    },
    {
      title: "Sandals & Accessories",
      text: "A curated selection of Arabic sandals and kandura accessories, completing a full traditional look.",
      href: "/category/arabic-sandals",
      image: "images/categories/arabic-sandals",
    },
  ],
};

export const HOME_VISIT = {
  eyebrow: "Home tailoring · We come to you",
  title: "We Come to You.",
  text: "Prefer to be fitted at home or in your majlis? Our tailors bring the fabrics, the measuring tape and decades of craft straight to your door.",
  steps: [
    { icon: "whatsapp", title: "Request on WhatsApp", text: "Message us your preferred date, time and area." },
    { icon: "home", title: "We Visit Your Home or Majlis", text: "A tailor arrives at your chosen time, anywhere across the Emirates we serve." },
    { icon: "fabric", title: "Fabrics & Measurements", text: "Browse fabric swatches in person and get measured precisely on the spot." },
    { icon: "check", title: "Delivered to Your Door", text: "Once tailored to perfection, your kanduras are delivered straight to you." },
  ],
};

export type Branch = { name: string; area: string; phone?: string };

/**
 * Branch names and areas as read from the existing website.
 * Check them and add each branch's phone number before launch.
 */
export const BRANCHES: { emirate: string; branches: Branch[] }[] = [
  {
    emirate: "Abu Dhabi",
    branches: [
      { name: "Al Falah Central Mall", area: "Al Falah" },
      { name: "Bani Yas Community Market", area: "Bani Yas" },
    ],
  },
  {
    emirate: "Dubai",
    branches: [
      { name: "Jumeirah Road", area: "Umm Suqeim 1" },
      { name: "Umm Suqeim Road", area: "Al Barsha 2" },
      { name: "Arabian Center", area: "Al Khawaneej" },
      { name: "Al Mizhar", area: "Al Mizhar 1" },
    ],
  },
  {
    emirate: "Sharjah",
    branches: [
      { name: "Nasiri Street", area: "Sharjah" },
      { name: "Al Wahda Street", area: "Bu Daniq" },
      { name: "University City Road", area: "Muwaileh" },
      { name: "Sharjah Co-op", area: "Al Qarayen" },
      { name: "Maliha Road", area: "Sharjah" },
    ],
  },
  { emirate: "Ajman", branches: [{ name: "Sheikh Zayed Street", area: "Ajman" }] },
  { emirate: "Ras Al Khaimah", branches: [{ name: "Sheikh Mohamed Bin Salem Road", area: "Ras Al Khaimah" }] },
];

export const directions = (b: Branch, emirate: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Al Musheer ${b.name} ${b.area} ${emirate}`)}`;

/** Sign-up popup with a countdown. Shown once per visitor until closed or joined. */
export const OFFER = {
  title: "Limited Time Offer",
  text: "Sign up to get an exclusive discount on your order.",
  minutes: 30, // countdown length; it keeps running across page refreshes
  delaySeconds: 8, // wait before showing (leaving the page on desktop opens it sooner)
  hideForDays: 3, // after "close", stay hidden this long
  points: [
    "Kandura tailoring since 1998",
    "13 branches across 5 Emirates",
    "Home tailoring visits at your door",
    "Finest fabrics, precision fit",
    "Order easily on WhatsApp",
  ],
};

/** Rotating messages in the bar above the header. */
export const ANNOUNCEMENTS: { icon: string; text: string; href?: string }[] = [
  { icon: "check", text: "Kandura tailoring since 1998" },
  { icon: "home", text: "Home tailoring: we come to you", href: "/#home-tailoring" },
  { icon: "pin", text: "13 branches across 5 Emirates", href: "/branches" },
  { icon: "whatsapp", text: `Order on WhatsApp ${PHONE_DISPLAY}`, href: WHATSAPP_URL },
];

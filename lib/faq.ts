/**
 * Frequently asked questions, grouped by topic. Answers follow the policy pages
 * (lib/policies.ts); these are drafts to review before launch, like the policies.
 * `image` is shown, tilted, beside the list while a question is hovered or open.
 */
export type Faq = { q: string; a: string; image: string; link?: { label: string; href: string } };
export type FaqTopic = { id: string; title: string; items: Faq[] };

export const FAQ: FaqTopic[] = [
  {
    id: "tailoring",
    title: "Tailoring & fit",
    items: [
      {
        q: "How long does a made-to-measure kandura take?",
        a: "Usually 7 to 10 working days from the day we take your measurements. Busy seasons such as Ramadan and Eid can take longer, so we recommend ordering early.",
        image: "images/categories/kandura-thobes",
      },
      {
        q: "What if my tailored kandura doesn't fit?",
        a: "Tell us within 14 days of delivery and we will adjust it free of charge, in any branch or during a home visit.",
        image: "images/categories/traditional-kandura",
        link: { label: "Returns & refunds", href: "/policies/refund" },
      },
      {
        q: "Can I choose my own fabric, collar and cuffs?",
        a: "Yes. Choose from our fabric swatches in branch or during a home visit, then pick your collar, cuff and tassel style. Your tailor will guide you if you're not sure.",
        image: "images/categories/adult-thobes",
      },
      {
        q: "Do you keep my measurements for next time?",
        a: "Yes. Once you've been measured we keep your measurements on file, so repeat orders are quick. Just send us a message on WhatsApp.",
        image: "images/content/story",
      },
    ],
  },
  {
    id: "home",
    title: "Home tailoring",
    items: [
      {
        q: "How do I book a home tailoring visit?",
        a: "Send us your preferred date, time and area on WhatsApp. We will confirm a slot and the tailor who will visit you at home or in your majlis.",
        image: "images/pages/contact",
        link: { label: "Book on WhatsApp", href: "home-visit" },
      },
      {
        q: "Which areas do you visit?",
        a: "We visit homes and majlis across the Emirates we serve: Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.",
        image: "images/pages/branches",
      },
      {
        q: "Can I change or cancel a visit?",
        a: "Of course. Let us know as early as you can, ideally at least 24 hours before the visit, and we will rebook it for you.",
        image: "images/pages/about",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Ready-made items in stock take 1 to 3 working days in Dubai, Sharjah and Ajman, and 2 to 4 working days elsewhere in the UAE.",
        image: "images/hero/hero-new",
        link: { label: "Shipping & delivery", href: "/policies/shipping" },
      },
      {
        q: "Can I order on WhatsApp?",
        a: "Yes. Every product has an \"Order on WhatsApp\" button, or message us any time with the item, size and colour you'd like.",
        image: "images/categories/kandura-jackets",
      },
      {
        q: "My order arrived damaged. What should I do?",
        a: "Contact us within 48 hours of delivery with your order number and a photo, and we will put it right. If the packaging is damaged, note it with the courier too.",
        image: "images/categories/bisht",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    items: [
      {
        q: "Can I return or exchange an item?",
        a: "Ready-made items can be returned or exchanged within 7 days of delivery or purchase, as long as they are unworn and in their original condition.",
        image: "images/categories/shimagh-ghutra",
        link: { label: "Returns & refunds", href: "/policies/refund" },
      },
      {
        q: "When will I get my refund?",
        a: "Once your return has been inspected and approved, we process the refund within 5 to 7 working days to your original payment method.",
        image: "images/categories/wallets",
      },
    ],
  },
  {
    id: "branches",
    title: "Branches & contact",
    items: [
      {
        q: "Where are your branches?",
        a: "We have 13 branches across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah. Use the branch finder to see the one nearest you.",
        image: "images/pages/branches",
        link: { label: "Find your nearest branch", href: "/contact#branches" },
      },
      {
        q: "How can I contact you?",
        a: "WhatsApp is the quickest way to reach us, or call us. You can also send a message from the contact page.",
        image: "images/pages/contact",
        link: { label: "Contact us", href: "/contact" },
      },
    ],
  },
];

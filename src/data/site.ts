export const site = {
  name: "Big Horn Contracting",
  phone: "+1 (505) 555-0148",
  phoneHref: "+15055550148",
  email: "hello@bighorncontracting.example",
  emailHref: "hello@bighorncontracting.example",
  city: "Albuquerque",
  region: "New Mexico",
  serviceArea: "Albuquerque and surrounding communities",
  domain: "https://www.bighorncontracting.example",
  hours: "Monday-Friday, 8:00 am-5:00 pm. Saturday by appointment. Hours to be confirmed.",
  address: "Albuquerque service area. Street address to be confirmed.",
  license: "License and insurance details to be confirmed",
  owner: "Gerardo",
  googleBusinessUrl: "#google-business-profile",
  socials: {
    facebook: "#facebook",
    instagram: "#instagram",
    google: "#google-business-profile",
  },
};

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  benefit: string;
  description: string;
  image: string;
  imageAlt: string;
  included: string[];
  faqs: { question: string; answer: string }[];
  secondary?: boolean;
};

export const services: Service[] = [
  {
    slug: "concrete",
    name: "Concrete",
    shortName: "Concrete",
    eyebrow: "A strong start",
    benefit: "A solid foundation for the way you live.",
    description:
      "From the first form to the final finish, we make concrete work feel clear, careful, and made for your home.",
    image:
      "https://images.pexels.com/photos/10855255/pexels-photo-10855255.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    imageAlt: "A welcoming outdoor patio with a clean paved entertaining area",
    included: [
      "Driveways, patios, and walkways",
      "Concrete slabs and additions",
      "Stamped and decorative finishes",
      "Site preparation and clean finishing",
    ],
    faqs: [
      {
        question: "Can you help plan the size and layout?",
        answer:
          "Yes. We can walk the space with you, talk through how you use it, and include a clear scope in your free estimate.",
      },
      {
        question: "Do you offer decorative concrete?",
        answer:
          "Stamped and decorative finishes can be discussed during your estimate. The best option depends on the look and use you have in mind.",
      },
    ],
  },
  {
    slug: "block",
    name: "Block & CMU",
    shortName: "Block",
    eyebrow: "Made to hold its ground",
    benefit: "Thoughtful masonry that gives your space definition.",
    description:
      "Block work can add privacy, structure, and a more finished feel to your outdoor space. We help you get the details right.",
    image:
      "https://images.pexels.com/photos/1693302/pexels-photo-1693302.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    imageAlt: "Close detail of a carefully laid masonry wall",
    included: [
      "CMU privacy and garden walls",
      "Retaining walls and wall repairs",
      "Outdoor structures and enclosures",
      "Cap, finish, and stucco-ready details",
    ],
    faqs: [
      {
        question: "Can block walls be finished to match my home?",
        answer:
          "In many cases, yes. We can discuss a stucco finish, cap, or other details that work with the existing exterior.",
      },
      {
        question: "Will I need a permit for a wall?",
        answer:
          "Permit needs depend on the wall, its height, and the property. We will flag questions during the estimate so the next steps are clear.",
      },
    ],
  },
  {
    slug: "stucco",
    name: "Stucco",
    shortName: "Stucco",
    eyebrow: "Made for this place",
    benefit: "A clean, lasting finish that feels at home in the Southwest.",
    description:
      "New stucco and careful repairs, planned for the color, texture, and character of your New Mexico home.",
    image:
      "https://images.pexels.com/photos/27395070/pexels-photo-27395070.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    imageAlt: "Sunlit stucco facade with simple Southwestern lines",
    included: [
      "New stucco for additions and walls",
      "Crack and surface repairs",
      "Color coats and texture choices",
      "Small updates that blend with existing stucco",
    ],
    faqs: [
      {
        question: "Can you match the color and texture I already have?",
        answer:
          "We will look at the existing finish with you and talk through the closest practical match. Sunlight and age can affect how colors appear.",
      },
      {
        question: "Do you work on small stucco repairs?",
        answer:
          "Tell us what you are seeing and where it is. We can let you know whether it is a fit during a free estimate.",
      },
    ],
  },
  {
    slug: "remodeling",
    name: "Interior Remodeling",
    shortName: "Remodeling",
    eyebrow: "A better everyday",
    benefit: "Room to feel more like you, without losing the calm.",
    description:
      "We help refresh the rooms you live in every day, with a clear plan and care for the rest of your home.",
    image:
      "https://images.pexels.com/photos/35493910/pexels-photo-35493910.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    imageAlt: "Warm, naturally lit kitchen with pale cabinetry and a welcoming finish",
    included: [
      "Kitchen and bathroom updates",
      "Flooring, drywall, and finish work",
      "Whole-room refreshes",
      "Thoughtful protection and daily cleanup",
    ],
    faqs: [
      {
        question: "Will we know what is happening while work is underway?",
        answer:
          "Clear communication is part of a good project. We agree on the scope and a point of contact before work begins, then keep you updated as things move along.",
      },
      {
        question: "Can we discuss one room at a time?",
        answer:
          "Absolutely. Tell us what matters most and we can look at a phased plan during your estimate.",
      },
    ],
  },
  {
    slug: "cleanup-hauling",
    name: "Cleanup & Hauling",
    shortName: "Cleanup & hauling",
    eyebrow: "A helpful extra",
    benefit: "A little help clearing the way when your project needs it.",
    description:
      "Cleanup and hauling are available as a secondary service when they are useful to your project. Ask us what is possible.",
    image:
      "https://images.pexels.com/photos/8134850/pexels-photo-8134850.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    imageAlt: "A clear, tidy driveway beside a finished modern home",
    included: [
      "Construction debris from an agreed project scope",
      "Light material removal and site tidying",
      "Haul-away details discussed before work begins",
    ],
    faqs: [
      {
        question: "Do you offer standalone junk removal?",
        answer:
          "Cleanup and hauling are a small secondary service. Please ask about your specific needs and we will let you know if we can help.",
      },
    ],
    secondary: true,
  },
];

const serviceNamesEs: Record<string, string> = {
  concrete: "Concreto",
  block: "Block y CMU",
  stucco: "Estuco",
  remodeling: "Remodelación interior",
  "cleanup-hauling": "Limpieza y retiro",
};

export function serviceNameForLocale(slug: string, locale: "en" | "es", fallback: string) {
  return locale === "es" ? serviceNamesEs[slug] ?? fallback : fallback;
}

export function serviceBenefitForLocale(slug: string, locale: "en" | "es", fallback: string) {
  if (locale === "en") return fallback;
  const benefits: Record<string, string> = {
    concrete: "Una base sólida para la vida diaria.",
    block: "Mampostería hecha para sostenerse.",
    stucco: "Un acabado que pertenece al suroeste.",
    remodeling: "Espacios interiores que se sienten como tuyos.",
    "cleanup-hauling": "Una ayuda extra cuando tu proyecto lo necesita.",
  };
  return benefits[slug] ?? fallback;
}

export const coreServices = services.filter((service) => !service.secondary);
export const surroundingAreas = [
  "Rio Rancho",
  "Bernalillo",
  "Los Lunas",
  "Belen",
  "Corrales",
  "Placitas",
  "Edgewood",
  "Moriarty",
];

export const processSteps = [
  { number: "01", title: "Tell us your idea", text: "A call or a short form is all it takes to start." },
  { number: "02", title: "Get a free estimate", text: "We listen, visit the space, and learn what matters to you." },
  { number: "03", title: "See the clear plan", text: "You will know the scope, price, and next steps before work begins." },
  { number: "04", title: "We build with care", text: "Your home is treated with respect and kept as tidy as the work allows." },
  { number: "05", title: "Walk through together", text: "We review the finished work with you and answer your questions." },
];
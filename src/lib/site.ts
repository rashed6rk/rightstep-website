export const site = {
  phone: "+971555520071",
  phoneDisplay: "+971 55 552 0071",
  email: "rightstepscons@gmail.com",
  whatsapp: "https://wa.me/971555520071",
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
  },
} as const;

/**
 * The six services Right Step Consultancy delivers. Order matters — the
 * homepage picks the first four for its overview grid (per section 20 of
 * the brand master doc), and the full services page renders all six in
 * this order. `communication` is deliberately first: it's the current
 * strategic focus of the firm and gets top billing everywhere.
 */
export const serviceKeys = [
  "communication",
  "leadership",
  "coaching",
  "corporate",
  "events",
  "supplier",
] as const;
export type ServiceKey = (typeof serviceKeys)[number];

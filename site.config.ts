/**
 * site.config.ts – the single source of truth for everything personal on this
 * site. Replace every placeholder value below with your own details. Nothing
 * else in the project needs to be edited to personalize it.
 *
 * Fields marked optional can be left as an empty string or empty array and
 * the site will simply omit them.
 */

export type Venture = {
  name: string;
  url: string;
  description: string;
};

export type SiteConfig = {
  /** Full display name, e.g. "Jane Doe" */
  name: string;
  /** Other names you go by, used in structured data (optional) */
  alternateNames: string[];
  /** Social handle shown under your name, without the @ */
  handle: string;
  /** Short role line, e.g. "Founder & CEO" */
  jobTitle: string;
  /** One-line bio shown on the card */
  bio: string;
  /** Longer description used for SEO metadata and structured data */
  description: string;
  /** Canonical site URL, no trailing slash, e.g. "https://janedoe.com" */
  siteUrl: string;
  /**
   * Optional: the auto-assigned Vercel host, e.g. "my-site.vercel.app".
   * When set (and siteUrl is filled in), the site permanently redirects that
   * host to siteUrl so only your custom domain serves the site. Leave empty
   * to skip the redirect.
   */
  vercelHost: string;
  /** Contact email */
  email: string;
  /** Nationality for structured data (optional, empty string to omit) */
  nationality: string;
  /** Social profile URLs; leave a value empty to hide that icon */
  socials: {
    x: string;
    instagram: string;
    linkedin: string;
    telegram: string;
    github: string;
  };
  /** Companies or projects listed on the card (optional, can be empty) */
  ventures: Venture[];
  /** English texts for the card language toggle */
  translations: {
    en: {
      bio: string;
      ventures: Venture[];
    };
  };
  /** Paths to assets in /public – swap the files, keep the paths */
  avatar: string;
  ogImage: string;
  favicon: string;
};

export const siteConfig: SiteConfig = {
  name: "Ігор Хамуляк",
  alternateNames: ["Ihor Khamuliak"],
  handle: "igorhml_",
  jobTitle: "Автоматизація і AI для бізнесу",
  bio: "Роблю системи, які працюють, поки ти спиш: AI-боти, автозвіти, автопостинг.",
  description:
    "Ihor Khamuliak is an automation developer and IT student based in Poznań, Poland. He builds AI assistants, Telegram bots and business automations with n8n, Python and the Claude API for businesses in Ukraine and Poland. Coding since age 17: Java, C++, now Python.",
  siteUrl: "https://khamuliak-automation.uk",
  vercelHost: "personal-card-site-one.vercel.app",
  email: "hamulakigor7@gmail.com",
  nationality: "Ukraine",
  socials: {
    x: "",
    instagram: "https://www.instagram.com/igorhml_",
    linkedin: "https://www.linkedin.com/in/ihorkhamuliak/",
    telegram: "https://t.me/Ihor_0O",
    github: "https://github.com/ihorkhamuliak",
  },
  ventures: [
    {
      name: "Портфоліо",
      url: "https://khamuliak-automation.uk/portfolio",
      description: "Кейси: AI-боти, автозвіти, автопостинг",
    },
    {
      name: "Залишити заявку",
      url: "https://khamuliak-automation.uk/start",
      description: "Опишіть задачу, відповім протягом дня",
    },
  ],
  translations: {
    en: {
      bio: "I build systems that work while you sleep: AI bots, auto-reports, auto-posting.",
      ventures: [
        {
          name: "Portfolio",
          url: "https://khamuliak-automation.uk/en/portfolio",
          description: "Case studies: AI bots, auto-reports, auto-posting",
        },
        {
          name: "Leave a request",
          url: "https://khamuliak-automation.uk/en/start",
          description: "Describe your task, I reply within a day",
        },
      ],
    },
  },
  avatar: "/avatar.png",
  ogImage: "/og-image.png",
  favicon: "/favicon.png",
};

/**
 * Site configuration — update these values to match your links and content.
 */

export const siteConfig = {
  nav: [
    { label: "Home", href: "/" },
    { label: "Brand", href: "/branding" },
  ],
  scheduleHref: "/schedule",
  scheduleEmbedSrc:
    "https://calendar.google.com/calendar/appointments/AcZssZ1wrWc2kovHxpzVnEe48c354w0BnjPfXdJBbL4=?gv=true",
  scheduleExternalHref: "https://calendar.app.google/SLPFWi8bM1uaCVR86",
  deployCta: {
    label: "Contact",
    href: "mailto:mboz7@proton.me",
  },
  bio: {
    fullBioHref: "/bio",
  },
  swingstr: {
    name: "Swingstr",
    description:
      "Full-Stack golf swing analysis software allowing Coaches to find, fix, and file golfer progressions.",
    launchHref: "https://swingstr.vercel.app",
    imageUrl: "/swingstr.png",
  },
  vercelProjectsHref: "https://vercel.com/mitch-bozentkas-projects",
  githubReposHref: "https://github.com",
  projects: [
    {
      id: "longhorn-ledger",
      name: "Longhorn Ledger",
      description:
        "In-round Strokes Gained calculator and performance tracker for The University of Texas Golf Club.",
      icon: "book",
      launchHref: "https://longhorn-ledger-six.vercel.app",
      screenshotUrl: "/screenshots/longhorn-ledger.png",
    },
    {
      id: "mempool-radio",
      name: "Mempool.radio",
      description:
        "Tune in to the rhythm of the chain—a sonified, real-time visualizer where you can hear the heartbeat of Bitcoin.",
      icon: "music",
      launchHref: "https://mempool-radio.vercel.app",
      screenshotUrl: "/screenshots/mempool-radio.png",
    },
    {
      id: "stock-swiper",
      name: "Stock Swiper",
      description:
        "A Tinder-like stock screener—swipe on stocks to find your next alpha.",
      icon: "trending",
      launchHref: "https://stock-swiper.vercel.app/",
      screenshotUrl: "/screenshots/stock-swiper.png",
    },
  ],
  nostr: {
    globalFeedHref: "https://njump.me",
  },
  footer: {
    privacyHref: "/privacy",
    legalHref: "/legal",
    nodeStatusHref: "/node",
  },
} as const;

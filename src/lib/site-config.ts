/**
 * Site configuration — update these values to match your links and content.
 */

export const siteConfig = {
  nav: [
    { label: "Manifesto", href: "/manifesto" },
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Sovereignty", href: "/sovereignty" },
  ],
  deployCta: {
    label: "Deploy",
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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRSi8h87II-hwsTRl_gttt1tDtuto1QkWvwkv6dCPFtND4EWDlgMTY_VO0ny9KjpIp3G_mlUMm2WUMQQn7NGUw4ClxHZzDm-u_qK13RK-_gIsk3NJLKnjM7vImtheuv7efyEOd1d-8UWsh0SkRuVFaGYQW_UUHDhBDUCL3VfF-XU8yi1E3ziOiuppN8lEYV3O7F2U5qP1vpNZwX_FMuOoED4tZuia8iSpGV7g8lwwwUSgRlYf1HT7-MzFnvwjoHT-mjuwq3EYIIg",
  },
  projects: [
    {
      id: "longhorn-ledger",
      name: "Longhorn Ledger",
      description:
        "In-round Strokes Gained calculator and performance tracker for The University of Texas Golf Club.",
      icon: "book",
      launchHref: "https://longhorn-ledger-six.vercel.app",
    },
    {
      id: "mempool-radio",
      name: "Mempool.radio",
      description:
        "Tune in to the rhythm of the chain—a sonified, real-time visualizer where you can hear the heartbeat of Bitcoin.",
      icon: "music",
      launchHref: "https://mempool-radio.vercel.app",
    },
    {
      id: "shopify-sats-back",
      name: "Shopify Sats-Back Plugin",
      description:
        "Coming Soon!",
      icon: "shield",
      launchHref: "#",
      comingSoon: true,
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

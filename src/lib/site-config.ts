/**
 * Site configuration — update these values to match your links and content.
 */

export const siteConfig = {
  scheduleHref: "/schedule",
  scheduleEmbedSrc: "https://calendar.app.google/81nEEYD2Nbj17b369",
  scheduleExternalHref: "https://calendar.app.google/81nEEYD2Nbj17b369",
  deployCta: {
    label: "Contact",
    href: "mailto:mitchell.bozentka@pga.com",
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
  vercelProjectsHref: "/projects",
  githubReposHref: "https://github.com/mpbozentka",
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
        "A live sonification of the mempool: steel drums drive the beat of every broadcasted transaction, and the tone rises and falls with the amount of BTC moving on-chain.",
      icon: "music",
      launchHref: "https://mempool-radio.vercel.app",
      screenshotUrl: "/screenshots/mempool-radio.png",
    },
    {
      id: "unspent",
      name: "Unspent",
      description: "Track and visualize your Bitcoin UTXOs.",
      icon: "trending",
      launchHref: "https://unspent-eta.vercel.app",
      screenshotUrl: "/screenshots/unspent.png",
    },
    {
      id: "bitcoin-retirement-planner",
      name: "Bitcoin Retirement Planner",
      description:
        "Model your path to retirement on a Bitcoin standard with DCA strategies, declining-CAGR growth curves, and multiple withdrawal approaches.",
      icon: "calculator",
      launchHref: "https://github.com/mpbozentka",
      screenshotUrl: "/screenshots/bitcoin-retirement-planner.png",
    },
    {
      id: "bitcoin-standard-financial-model",
      name: "Bitcoin Standard Financial Model",
      description:
        "Monthly DCA simulator with real Strike fee tiers, bull/neutral/bear scenario modeling, and detailed cost-basis tracking.",
      icon: "chart",
      launchHref: "https://github.com/mpbozentka",
      screenshotUrl: "/screenshots/bitcoin-standard-financial-model.png",
    },
  ],
  newsletter: {
    /** Get this from Beehiiv: Audience > Subscribe forms > Create/form > Get embed code — use the form ID from the iframe src. */
    beehiivFormId: "a4dcbbb1-daf0-47a1-bdab-d736425783f0",
  },
  nostr: {
    globalFeedHref: "https://njump.me",
  },
  footer: {
    privacyHref: "/privacy",
    legalHref: "/legal",
    nodeStatusHref: "/node",
  },
} as const;

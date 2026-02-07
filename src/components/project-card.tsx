"use client";

import { motion } from "framer-motion";
import { ExternalLink, Bitcoin, DollarSign, Video } from "lucide-react";

export type BadgeVariant = "live" | "beta" | "building";
export type ProjectIcon = "video" | "dollar" | "bitcoin";

const iconMap = {
  video: Video,
  dollar: DollarSign,
  bitcoin: Bitcoin,
};

interface ProjectCardProps {
  title: string;
  description: string;
  badge: string;
  badgeVariant: BadgeVariant;
  icon: ProjectIcon;
  pricing?: string | null;
  launchUrl?: string | null;
  featured?: boolean;
}

const badgeStyles: Record<BadgeVariant, string> = {
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  beta: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  building: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export function ProjectCard({
  title,
  description,
  badge,
  badgeVariant,
  icon,
  pricing = null,
  launchUrl,
  featured = false,
}: ProjectCardProps) {
  const Icon = iconMap[icon];
  const canLaunch = launchUrl && badgeVariant !== "building";

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:border-slate-700/50 hover:bg-slate-800/50 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-emerald-400 ring-1 ring-slate-700/50">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${badgeStyles[badgeVariant]}`}
            >
              {badge}
            </span>
            {pricing != null && pricing !== "" && (
              <span className="rounded-full border border-slate-600/50 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300">
                {pricing}
              </span>
            )}
          </div>
        </div>

        <h3
          className={`font-semibold text-white ${
            featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-slate-400 ${
            featured ? "text-base md:text-lg" : "text-sm"
          }`}
        >
          {description}
        </p>

        <div className="mt-4 flex-1">
          {canLaunch ? (
            <a
              href={launchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Launch
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-800/30 px-4 py-2 text-sm font-medium text-slate-500">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

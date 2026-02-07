"use client";

import { motion } from "framer-motion";
import { Bitcoin, DollarSign, Video } from "lucide-react";

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
  featured = false,
}: ProjectCardProps) {
  const Icon = iconMap[icon];
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
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${badgeStyles[badgeVariant]}`}
          >
            {badge}
          </span>
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
      </div>
    </motion.article>
  );
}

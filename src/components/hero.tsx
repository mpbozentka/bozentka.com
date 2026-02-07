"use client";

import { motion } from "framer-motion";
import { BookLessonButton } from "./book-lesson-button";

export function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <motion.div
        className="max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Engineering the{" "}
          <span className="text-emerald-400">Fairway</span> & the{" "}
          <span className="text-emerald-400">Blockchain</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
          Bozentka Labs is a digital product studio building tools for Golf
          Professionals and Bitcoiners.
        </p>
        <motion.button
          onClick={scrollToProjects}
          className="mt-10 rounded-xl bg-emerald-500 px-8 py-3.5 font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          View Projects
        </motion.button>
        <div className="mt-4">
          <BookLessonButton />
        </div>
      </motion.div>
    </section>
  );
}

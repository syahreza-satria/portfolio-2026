"use client";

// Tambahkan AnimatePresence pada import
import { motion, AnimatePresence } from "framer-motion"; // Sesuaikan dengan setup Anda (bisa juga "motion/react")
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import SideNav from "@/components/custom/SideNav";
import { PiCode, PiVideo, PiDownload } from "react-icons/pi";
import { SiGithub } from "react-icons/si";
import { skillset } from "./data";
import GithubCalendar from "@/components/custom/GithubCalendar";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const categories = ["ALL", ...new Set(skillset.map((skill) => skill.category))];

  const filteredSkills = activeFilter === "ALL" ? skillset : skillset.filter((skill) => skill.category === activeFilter);

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 lg:col-span-9 w-full space-y-6 overflow-hidden">
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium tracking-tighter">Hey There It&apos;s Reza 👋</h1>
          <span className="text-neutral-400 text-lg">• Based in Bandung, Indonesia • Onsite</span>
          <div className="text-neutral-300 flex flex-col gap-6 text-base mt-4">
            <p>
              I&apos;m a full-stack web developer, UI designer, and content creator focused on building impactful digital solutions. My expertise includes developing modern web and mobile platforms using Laravel, React/Next.js.
              (JavaScript), Tailwind CSS, dan Flutter.
            </p>
            <p>
              I prioritize structured system architecture and clean, minimalist interface design that aligns with business objectives. Drawing on my IT leadership experience, I ensure each project is executed functionally and logically,
              providing an optimal user experience.
            </p>
          </div>
        </section>

        <hr className="border-neutral-700" />

        <section className="flex flex-col space-y-1">
          <h2 className="text-2xl flex items-center gap-2 text-neutral-100 font-medium tracking-tight">
            <PiCode className="size-6" />
            Skillset & Tools
          </h2>
          <p className="text-neutral-400 text-lg mb-3">All of the tools and skills that I use</p>
 
          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-medium text-neutral-500">
            {categories.map((category) => {
              const isActive = activeFilter === category;
              const count = category === "ALL" ? skillset.length : skillset.filter((s) => s.category === category).length;
 
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  type="button"
                  className={`py-1 px-3 text-xs rounded-full flex gap-2 items-center cursor-pointer transition-colors duration-300 ${
                    isActive ? "bg-emerald-500/30 text-white border border-emerald-500/30" : "bg-neutral-950 border border-neutral-700 hover:bg-neutral-800"
                  }`}
                >
                  {category}
                  <span className={`py-0.5 px-2 rounded-full text-[10px] ${isActive ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-400"}`}>{count}</span>
                </button>
              );
            })}
          </div>
 
          {/* Items dengan Animasi */}
          <motion.div layout className="flex flex-wrap gap-2 pt-2">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.button
                  key={skill.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 200, damping: 20 }}
                  whileHover={{ y: -4 }}
                  type="button"
                  className={`flex items-center gap-2 border border-neutral-600 py-1.5 px-3 rounded-full hover:-translate-y-1 w-fit whitespace-nowrap ${skill.bgClass}`}
                >
                  {skill.icon}
                  <span className="text-sm font-medium text-neutral-200">{skill.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
 
        <motion.hr layout="position" className="border-neutral-700 my-4" />
 
        <section className="flex flex-col space-y-1">
          <h2 className="text-2xl flex items-center gap-2 text-neutral-100 font-medium tracking-tight">
            <SiGithub className="size-6 text-neutral-100" />
            GitHub Contributions
          </h2>
          <p className="text-neutral-400 text-lg mb-3">My open source contributions and activity</p>
          <GithubCalendar username="syahreza-satria" />
        </section>
 
        <motion.hr layout="position" className="border-neutral-700 my-4" />
 
        <section className="flex flex-col space-y-1">
          <h2 className="text-2xl flex items-center gap-2 text-neutral-100 font-medium tracking-tight">
            <PiVideo className="size-6 text-neutral-100" />
            Latest Content
          </h2>
          <p className="text-neutral-400 text-lg mb-3">Check out my latest video content</p>
 
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-neutral-700/50 bg-neutral-900/50 shadow-2xl ring-1 ring-white/5">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/uN6TN7PmXmE?si=fo56jnavGzr6OuW_&amp;controls=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

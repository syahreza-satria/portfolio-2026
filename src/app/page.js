"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import SideNav from "@/components/custom/SideNav";
import { PiCode } from "react-icons/pi";
import { skillset } from "./data";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const categories = ["ALL", ...new Set(skillset.map((skill) => skill.category))];

  const filteredSkills = activeFilter === "ALL" ? skillset : skillset.filter((skill) => skill.category === activeFilter);
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />
      <div className="col-span-9 w-full space-y-10">
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium tracking-tighter">Hey There It&apos;s Reza 👋</h1>
          <span className="text-neutral-500 text-lg">Based in Bandung, Indonesia</span>
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

        <section className="flex flex-col space-y-4">
          <h2 className="text-2xl flex items-center gap-2 text-neutral-100">
            <PiCode className="size-6" />
            Skillset & Tools
          </h2>
          <p className="text-neutral-400 text-lg">All of the tools and skills that I use</p>

          {/* Filter */}
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

          {/* Items */}
          <div className="flex flex-wrap gap-2 pt-2">
            {filteredSkills.map((skill) => (
              <button key={skill.id} type="button" className={`flex items-center gap-2 border border-neutral-600 py-1.5 px-3 rounded-full transition-all duration-300 hover:-translate-y-1 ${skill.bgClass}`}>
                {skill.icon}
                <span className="text-sm font-medium text-neutral-200">{skill.name}</span>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-neutral-700" />
      </div>
    </div>
  );
}

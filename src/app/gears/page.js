"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Pastikan menggunakan "motion/react" atau "framer-motion" sesuai setup Anda
import SideNav from "../../components/custom/SideNav";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "@/components/SpotlightCard";
import { gears } from "../data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Gear() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const uniqueCategories = ["All", ...new Set(gears.map((gear) => gear.category))];

  const filteredGears = selectedCategory === "All" ? gears : gears.filter((gear) => gear.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 15,
      },
    },
  };
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />

      <motion.div animate={{ y: "0%", opacity: 1 }} initial={{ y: "10%", opacity: 0 }} transition={{ duration: 0.8 }} className="col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">Gear</h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A detailed look at the hardware tools that power my daily workflow, from full-stack development to UI/UX design and content creation.</p>
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-neutral-400 font-medium text-sm">Showing {filteredGears.length} items</p>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-50 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500/50 outline-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                  {category === "All" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGears.map((gear) => (
            // Bungkus dengan motion.div dan berikan itemVariants
            // Tambahkan class h-full agar tinggi kartu tetap rata
            <motion.div variants={itemVariants} key={gear.id} className="h-full">
              <SpotlightCard data={gear} className="custom-spotlight-card p-0! flex flex-col gap-3 rounded-3xl h-full group" spotlightColor="rgba(0, 229, 255, 0.15)">
                <div className="relative w-full aspect-square rounded-t-3xl overflow-hidden border-b border-neutral-700/50 bg-neutral-900/50">
                  <Image src={gear.image} alt={gear.model} fill loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-w-7xl) 33vw, 100vw" />
                </div>

                <div className="px-5 py-3 flex flex-col grow">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-emerald-500 tracking-wider uppercase">{gear.brand}</span>
                    <h3 className="text-white font-medium text-lg tracking-tight leading-snug">{gear.model}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mt-1">{gear.description}</p>
                  </div>

                  <div className="mt-auto flex flex-col pt-5 pb-2">
                    <hr className="border-neutral-700/80 mb-3" />
                    <a href={gear.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full text-neutral-400 hover:text-white transition-colors duration-300 group/link">
                      <span className="text-[11px] font-semibold tracking-widest uppercase">View Product</span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.section>

        {filteredGears.length === 0 && <div className="w-full text-center py-12 text-neutral-500 bg-neutral-900/20 rounded-xl border border-neutral-800 border-dashed">No gears found in this category.</div>}
      </motion.div>
    </div>
  );
}

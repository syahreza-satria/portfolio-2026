"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SideNav from "../../components/custom/SideNav";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { achievement } from "../data";
import { child, parent } from "../../../animation";

export default function Achievement() {
  // 1. State untuk menyimpan filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 2. Mengambil data unik secara dinamis untuk dropdown
  const uniqueTypes = ["All", ...new Set(achievement.map((item) => item.type))];
  const uniqueCategories = ["All", ...new Set(achievement.map((item) => item.category))];

  // 3. Logika Filter Data
  const filteredAchievements = achievement.filter((achieve) => {
    // Pencarian berdasarkan judul ATAU organizer
    const matchesSearch = achieve.title.toLowerCase().includes(searchQuery.toLowerCase()) || achieve.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    // Pencarian berdasarkan dropdown
    const matchesType = selectedType === "All" || achieve.type === selectedType;
    const matchesCategory = selectedCategory === "All" || achieve.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />

      <motion.div animate={{ y: "0%", opacity: 1 }} initial={{ y: "10%", opacity: 0 }} transition={{ duration: 0.8 }} className="col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">Achievement</h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A curated showcase of certifications and milestones reflecting my ongoing commitment to professional growth and technical excellence.</p>
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="space-y-6">
          {/* Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
            <Input
              type="text"
              placeholder="Search title or organizer..."
              className="bg-neutral-800 border-neutral-700 w-full md:max-w-xs text-neutral-200 focus-visible:ring-emerald-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex gap-3 w-full md:w-auto">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-37.5 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500/50">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                      {type === "All" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500/50">
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
            </div>
          </div>

          <p className="text-neutral-400 font-medium text-sm">Showing {filteredAchievements.length} achievements</p>

          <motion.div variants={parent} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...filteredAchievements]
              .sort((a, b) => a.id - b.id)
              .map((achieve) => (
                <motion.div variants={child} key={achieve.id} className="h-full">
                  <SpotlightCard className="custom-spotlight-card p-0! flex flex-col gap-3 rounded-3xl h-full group" spotlightColor="rgba(0, 229, 255, 0.15)">
                    <div className="relative w-full aspect-297/210 rounded-t-3xl overflow-hidden border-b border-neutral-700/50">
                      <Image src={achieve.image} alt={achieve.title} fill loading="eager" className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-w-7xl) 33vw, 100vw" priority={false} />
                    </div>

                    <div className="px-4 py-2 flex flex-col grow">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-mono text-neutral-500 tracking-wider">{achieve.credentialId}</span>
                        <h3 className="text-white font-medium tracking-tight leading-snug line-clamp-2">{achieve.title}</h3>
                        <p className="text-neutral-400 text-sm">{achieve.organizer}</p>
                      </div>

                      <div className="mt-auto flex flex-col pt-4 pb-2">
                        <div className="flex w-full flex-wrap justify-start gap-2 mb-4">
                          <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                            {achieve.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                            {achieve.category}
                          </Badge>
                        </div>

                        <div>
                          <hr className="border-neutral-700/80 mb-3" />
                          <span className="text-neutral-500 text-[11px] font-semibold tracking-widest uppercase">ISSUED ON {achieve.issuedDate}</span>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
          </motion.div>

          {filteredAchievements.length === 0 && <div className="w-full text-center py-12 text-neutral-500 bg-neutral-900/20 rounded-xl border border-neutral-800 border-dashed">No achievements found matching your criteria.</div>}
        </section>
      </motion.div>
    </div>
  );
}

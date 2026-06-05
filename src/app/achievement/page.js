"use client";

import { Input } from "@/components/ui/input";
import SideNav from "../../components/custom/SideNav";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { achievement } from "../data";

export default function Achievement() {
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />

      <div className="col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">Achievement</h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A curated showcase of achieveifications and milestones reflecting my ongoing commitment to professional growth and technical excellence.</p>
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="space-y-4">
          {/* Filter */}
          <div className="flex justify-between">
            <Input type={"text"} placeholder="Search..." className={"bg-neutral-800 border-neutral-700"} />
            <div className="flex items-center"></div>
          </div>

          <p>Total: 13</p>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            {[...achievement]
              .sort((a, b) => a.id - b.id)
              .map((achieve) => (
                <SpotlightCard key={achieve.id} className="custom-spotlight-card p-0! flex flex-col gap-3 rounded-3xl group" spotlightColor="rgba(0, 229, 255, 0.15)">
                  <div className="relative w-full aspect-297/210 rounded-t-3xl overflow-hidden border-b border-neutral-700/50">
                    <Image src={achieve.image} alt={achieve.title} fill loading="eager" className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-w-7xl) 33vw, 100vw" priority={false} />
                  </div>

                  <div className="px-4 py-2 flex flex-col grow">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-mono text-neutral-500 tracking-wider">{achieve.credentialId}</span>

                      <h3 className="text-white font-medium tracking-tight leading-snug line-clamp-2">{achieve.title}</h3>

                      <p className="text-neutral-400 text-sm">{achieve.organizer}</p>

                      <div className="flex w-full flex-wrap justify-start gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                          {achieve.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                          {achieve.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <hr className="border-neutral-700/80 mb-3" />
                      <span className="text-neutral-500 text-[11px] font-semibold tracking-widest uppercase">ISSUED ON {achieve.issuedDate}</span>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

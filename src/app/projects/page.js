"use client";

import { motion } from "motion/react";
import Link from "next/link";
import SideNav from "../../components/custom/SideNav";

export default function Project() {
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />

      <motion.div animate={{ y: "0%", opacity: 1 }} initial={{ y: "10%", opacity: 0 }} transition={{ duration: 0.8 }} className="col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">Project</h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A curated collection of web applications and design projects, showcasing my expertise in building scalable solutions and intuitive user experiences.</p>
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="grid grid-cols-2">
          <Link href={"#"}></Link>
        </section>
      </motion.div>
    </div>
  );
}

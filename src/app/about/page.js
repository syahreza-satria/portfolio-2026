"use client";

import { motion } from "motion/react";
import { PiBriefcase, PiCode } from "react-icons/pi";
import SideNav from "../../components/custom/SideNav";
import ExperienceCard from "@/components/custom/ExperienceCard";
import { educations, experiences } from "../data";
import EducationCard from "@/components/custom/EducationCard";
import { child, parent } from "../../../animation";

export default function Home() {
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />

      <motion.div animate={{ y: "0%", opacity: 1 }} initial={{ y: "10%", opacity: 0 }} transition={{ duration: 0.8 }} className="col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">About</h1>
          <span className="text-neutral-400 text-lg">A brief introduction to who I am.</span>
          <hr className="border-neutral-700 border-dashed my-2" />
          <div className="text-neutral-300 flex flex-col gap-6 text-lg mt-4">
            <p>
              I&apos;m Syahreza Satria, a Bandung-based Web Developer and UI Designer dedicated to building impactful digital solutions. I specialize in developing modern web platforms and mobile applications using a robust tech stack,
              including Laravel, React/Next.js (JavaScript), Tailwind CSS, and Flutter.{" "}
            </p>
            <p>
              My primary focus is crafting structured system architecture and clean, ultra-minimalist interface designs that align with business objectives. I believe that high-quality code must go hand-in-hand with logical clarity and an
              optimal user experience.
            </p>
            <p>
              I blend technical expertise with proactive communication, critical thinking, and effective time management. Drawing on my IT leadership experience, I thrive in collaborative environments and ensure every project is executed
              functionally and logically to deliver real-world impact.
            </p>
            <p>Best Regards,</p>
          </div>
        </section>

        <hr className="border-neutral-700" />

        <section className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium flex items-center gap-2 text-neutral-300">
              <PiBriefcase className="size-5" />
              Career
            </h2>
            <p className="text-neutral-400 text-lg">My work journey.</p>
          </div>

          <motion.div variants={parent} initial="hidden" animate="show" className="flex flex-col items-start space-y-4 ">
            {[...experiences]
              .sort((a, b) => a.id - b.id)
              .map((exp) => (
                <motion.div variants={child} key={exp.id} className="w-full">
                  <ExperienceCard data={exp} />
                </motion.div>
              ))}
          </motion.div>
        </section>

        <hr className="border-neutral-700" />

        <section className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium flex items-center gap-2 text-neutral-300">
              <PiBriefcase className="size-5" />
              Education
            </h2>
            <p className="text-neutral-400 text-lg">My education journey.</p>
          </div>

          <div className="flex flex-col items-start space-y-4">
            {[...educations]
              .sort((a, b) => a.id - b.id)
              .map((edu) => (
                <EducationCard key={edu.id} data={edu} />
              ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}

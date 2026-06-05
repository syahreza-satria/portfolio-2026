"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import { FaAngleRight, FaListUl, FaCheck } from "react-icons/fa";
import SpotlightCard from "../SpotlightCard";

const ExperienceCard = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <SpotlightCard className="custom-spotlight-card flex items-start gap-4 w-full" spotlightColor="rgba(0, 229, 255, 0.2)">
      <Image src={data.logo} width={70} height={70} alt={`${data.company} Logo`} className="rounded-2xl" loading="eager" />

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-0">
          <h3 className="font-medium text-lg">{data.role}</h3>
          <p className="text-neutral-400 text-sm flex gap-2">
            {data.company} <span className="text-neutral-600">•</span>
            {data.location}
          </p>
        </div>

        <p className="text-neutral-400 text-sm flex gap-2 flex-wrap">
          {data.startDate} - {data.endDate}
          <span className="text-neutral-600">•</span>
          {data.duration}
          <span className="text-neutral-600">•</span>
          {data.type}
          <span className="text-neutral-600">•</span>
          {data.setup}
        </p>

        <button type="button" onClick={() => setShowDetails(!showDetails)} className="text-sm flex items-center gap-1 cursor-pointer text-neutral-500 hover:text-neutral-100 transition duration-300 w-fit mt-1">
          <FaAngleRight className={`size-4 transition-transform duration-300 ${showDetails ? "rotate-90" : ""}`} />
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        {/* Framer Motion AnimatePresence untuk animasi Show/Close */}
        <AnimatePresence>
          {showDetails && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
              {/* Wrapper konten dalam agar margin/padding tidak mengganggu kalkulasi tinggi animasi */}
              <div className="flex flex-col gap-1 space-y-2 mt-3 pt-3 border-t border-neutral-700/50">
                <h4 className="flex gap-1 items-center font-medium text-emerald-500 text-sm tracking-wider">
                  <FaListUl className="size-3" />
                  RESPONSIBILITIES
                </h4>
                <ul className="space-y-2">
                  {data.responsibilities.map((task, index) => (
                    <li key={index} className="flex gap-2 items-start text-neutral-500 text-sm">
                      <FaCheck className="size-3 shrink-0 mt-1" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SpotlightCard>
  );
};

export default ExperienceCard;

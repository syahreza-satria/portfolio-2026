"use client";

import SpotlightCard from "@/components/SpotlightCard";
import SideNav from "../../components/custom/SideNav";
import { ArrowUpRight } from "lucide-react";
import { SiGithub, SiGmail, SiInstagram, SiTiktok } from "react-icons/si";
import ContactForm from "@/components/custom/ContactForm";
import { motion } from "framer-motion"; // Pastikan import ini menggunakan framer-motion atau motion/react sesuai setup Anda
import { FaLinkedinIn } from "react-icons/fa";

// 1. Definisikan Variants untuk container (grid)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.8,
      staggerChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Contact() {
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 lg:col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">Contact</h1>
          <span className="text-neutral-400 text-lg">Collaborate with me.</span>
        </section>

        <hr className="border-neutral-700 border-dashed my-4" />

        <section className="pt-2 space-y-4">
          <h2 className="text-xl font-semibold text-white">Hit me on any of my socials</h2>

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gmail */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
              <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#ea4335] to-[#7f1d1d] h-full" spotlightColor="rgba(255, 255, 255, 0.15)">
                <div className="space-y-2">
                  <h3 className="text-lg text-white font-semibold">Get in Touch With Me</h3>
                  <p className="text-sm text-white/90">Reach out via email for inquiries or collaborations.</p>
                  <a href="mailto:satriaeza221@gmail.com" className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium">
                    Send an Email
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <SiGmail className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
              </SpotlightCard>
            </motion.div>

            {/* Instagram */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] h-full" spotlightColor="rgba(255, 255, 255, 0.2)">
                <div className="space-y-2">
                  <h3 className="text-lg text-white font-semibold">Get in Touch With Me</h3>
                  <p className="text-sm text-white/90">See my journey.</p>
                  <a
                    href="https://instagram.com/syahreza_satria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                  >
                    See Instagram
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <SiInstagram className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
              </SpotlightCard>
            </motion.div>

            {/* LinkedIn */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#0A66C2] to-[#004182] h-full" spotlightColor="rgba(255, 255, 255, 0.2)">
                <div className="space-y-2">
                  <h3 className="text-lg text-white font-semibold">LinkedIn Profile</h3>
                  <p className="text-sm text-white/90">Connect with me professionally.</p>
                  <a
                    href="https://linkedin.com/in/syahreza-satria-alfath"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                  >
                    Connect
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <FaLinkedinIn className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
              </SpotlightCard>
            </motion.div>

            {/* Tiktok */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#000000] to-[#1a1a1a] h-full" spotlightColor="rgba(254, 44, 85, 0.25)">
                <div className="space-y-2">
                  <h3 className="text-lg text-white font-semibold">TikTok</h3>
                  <p className="text-sm text-white/90">Discover my short-form content and highlights.</p>
                  <a
                    href="https://tiktok.com/@syahrezasatria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                  >
                    Watch TikTok
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <SiTiktok className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
              </SpotlightCard>
            </motion.div>

            {/* Github */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#24292e] to-[#0d1117] h-full" spotlightColor="rgba(255, 255, 255, 0.15)">
                <div className="space-y-2">
                  <h3 className="text-lg text-white font-semibold">GitHub Profile</h3>
                  <p className="text-sm text-white/90">Explore my source code and projects.</p>
                  <a
                    href="https://github.com/syahreza-satria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                  >
                    View GitHub
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <SiGithub className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </section>

        <hr className="border-neutral-700 border-dashed my-4" />

        <motion.section variants={itemVariants} initial="hidden" animate="show" className="space-y-4">
          <ContactForm />
        </motion.section>
      </motion.div>
    </div>
  );
}

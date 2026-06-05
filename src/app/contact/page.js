"use client";

import SpotlightCard from "@/components/SpotlightCard";
import SideNav from "../../components/custom/SideNav";
import { ArrowUpRight } from "lucide-react";
import { SiGithub, SiGmail, SiInstagram, SiTiktok } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";
import ContactForm from "@/components/custom/ContactForm";

export default function Contact() {
  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8">
      <SideNav />

      <div className="col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tighter">Contact</h1>
          <span className="text-neutral-400 text-lg">Collaborate with me.</span>
        </section>

        <hr className="border-neutral-700 border-dashed my-4" />

        <section className="pt-2 space-y-4">
          <h2>Hit me on any of my socials</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Gmail */}
            <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#ea4335] to-[#7f1d1d] col-span-2" spotlightColor="rgba(255, 255, 255, 0.15)">
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

            {/* Instagram */}
            <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" spotlightColor="rgba(255, 255, 255, 0.2)">
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

            {/* LinkedIn */}
            <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#0A66C2] to-[#004182]" spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="space-y-2">
                <h3 className="text-lg text-white font-semibold">LinkedIn Profile</h3>
                <p className="text-sm text-white/90">Connect with me professionally.</p>

                {/* Jangan lupa ganti URL href ini dengan link profil LinkedIn Anda */}
                <a
                  href="https://linkedin.com/in/username_anda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                >
                  Connect
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              {/* Pastikan Anda sudah meng-import SiLinkedin dari react-icons/si */}
              <SlSocialLinkedin className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
            </SpotlightCard>

            {/* Tiktok */}
            <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#000000] to-[#1a1a1a]" spotlightColor="rgba(254, 44, 85, 0.25)">
              <div className="space-y-2">
                <h3 className="text-lg text-white font-semibold">TikTok</h3>
                <p className="text-sm text-white/90">Discover my short-form content and highlights.</p>

                {/* Jangan lupa ganti URL href ini dengan link profil TikTok Anda */}
                <a
                  href="https://tiktok.com/@username_anda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                >
                  Watch TikTok
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              {/* Pastikan Anda sudah meng-import SiTiktok dari react-icons/si */}
              <SiTiktok className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
            </SpotlightCard>

            {/* Github */}
            <SpotlightCard className="custom-spotlight-card flex justify-between rounded-lg! bg-linear-to-br from-[#24292e] to-[#0d1117]" spotlightColor="rgba(255, 255, 255, 0.15)">
              <div className="space-y-2">
                <h3 className="text-lg text-white font-semibold">GitHub Profile</h3>
                <p className="text-sm text-white/90">Explore my source code and projects.</p>

                {/* Jangan lupa ganti URL href ini dengan link profil GitHub Anda */}
                <a
                  href="https://github.com/username_anda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md transition duration-300 w-fit text-white py-2 px-4 flex items-center gap-2 rounded-md mt-4 font-medium"
                >
                  View GitHub
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              {/* Pastikan Anda sudah meng-import SiGithub dari react-icons/si */}
              <SiGithub className="size-12 p-2 rounded-md border-2 mt-auto border-white/60 text-white" />
            </SpotlightCard>
          </div>
        </section>

        <hr className="border-neutral-700 border-dashed my-4" />

        <section className="space-y-4">
          <h2>Or send me a message</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}

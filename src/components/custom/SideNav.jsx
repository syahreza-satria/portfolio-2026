"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { PiHouse, PiUser, PiCertificate, PiProjectorScreenChart, PiFolderUser, PiLaptop } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import RotatingText from "../RotatingText";
import { ArrowRight } from "lucide-react";
import ShinyText from "../ShinyText";

const SideNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/", icon: <PiHouse className="size-4.5" /> },
    { name: "About", path: "/about", icon: <PiUser className="size-4.5" /> },
    { name: "Achievement", path: "/achievement", icon: <PiCertificate className="size-4.5" /> },
    { name: "Projects", path: "/projects", icon: <PiProjectorScreenChart className="size-4.5" /> },
    { name: "Gears", path: "/gears", icon: <PiLaptop className="size-4.5" /> },
    { name: "Contact", path: "/contact", icon: <PiFolderUser className="size-4.5" /> },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="col-span-3 flex flex-col gap-6 items-center w-full sticky top-8 h-fit">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-3">
          <Image src={"/images/brand-logo.png"} width={96} height={96} alt="Logo" className="rounded-full border-[3px] border-emerald-700/80 p-0.5 object-cover" loading="eager" />
          <h1 className="font-bold flex items-center gap-1.5 text-[15px] text-white tracking-tight">
            SYAHREZA SATRIA <RiVerifiedBadgeFill className="size-5 text-blue-500" />
          </h1>
          <p className="flex items-center gap-2 bg-green-500/20 px-6 py-1 rounded-2xl border border-green-500">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
            </span>

            <RotatingText
              texts={["Web Developer", "UI/UX Designer", "Content Creator", "Graphic Designer", "Gamer"]}
              mainClassName="text-xs text-green-500 font-medium"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={5000}
              splitBy="words"
              auto
              loop
            />
          </p>
        </div>

        <hr className="w-full border-neutral-700" />

        <section className="flex flex-col items-start w-full gap-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center font-medium py-2.5 px-4 justify-between w-full transition-colors duration-300 rounded-xl group ${isActive ? "bg-neutral-800/40 text-gray-100" : "text-neutral-400 hover:bg-neutral-800/40 hover:text-gray-100"}`}
              >
                <div className="flex gap-3 items-center ">
                  <span className={`transition-colors ${isActive ? "text-gray-300" : "text-neutral-500 group-hover:text-gray-300"}`}>{item.icon}</span>

                  {isActive ? <ShinyText text={item.name} speed={2} delay={0} color="#b5b5b5" shineColor="#ffffff" spread={120} direction="left" yoyo={false} pauseOnHover={false} disabled={false} /> : <span>{item.name}</span>}
                </div>
                {isActive ? <ArrowRight className="size-4 text-neutral-400" /> : ""}
              </Link>
            );
          })}
        </section>

        <hr className="w-full border-neutral-700" />

        <div className="flex flex-col gap-1 text-center text-neutral-500 pb-6 text-sm">
          <span>COPYRIGHT © {currentYear}</span>
          <span>Syahreza Satria. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

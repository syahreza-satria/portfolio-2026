"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { PiHouse, PiUser, PiCertificate, PiProjectorScreenChart, PiFolderUser, PiLaptop, PiSignIn, PiSignOut, PiDownload, PiChatText } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import RotatingText from "../RotatingText";
import { ArrowRight } from "lucide-react";
import ShinyText from "../ShinyText";
import { useAuth } from "@/lib/auth";

const SideNav = () => {
  const pathname = usePathname();
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: <PiHouse className="size-4.5" /> },
    { name: "About", path: "/about", icon: <PiUser className="size-4.5" /> },
    { name: "Achievement", path: "/achievement", icon: <PiCertificate className="size-4.5" /> },
    { name: "Projects", path: "/projects", icon: <PiProjectorScreenChart className="size-4.5" /> },
    { name: "Gears", path: "/gears", icon: <PiLaptop className="size-4.5" /> },
    { name: "Guestbook", path: "/guestbook", icon: <PiChatText className="size-4.5" /> },
    { name: "Contact", path: "/contact", icon: <PiFolderUser className="size-4.5" /> },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="col-span-1 lg:col-span-3 w-full">
      {/* --- MOBILE & TABLET HEADER --- */}
      <div className="flex lg:hidden items-center justify-between w-full p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl mb-2 gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/brand-logo.png"
            width={40}
            height={40}
            alt="Logo"
            className="rounded-full border-2 border-emerald-700/80 p-0.5 object-cover shrink-0"
            loading="eager"
          />
          <div className="flex flex-col">
            <h1 className="font-bold flex items-center gap-1.5 text-[14px] text-white tracking-tight">
              SYAHREZA SATRIA <RiVerifiedBadgeFill className="size-4 text-blue-500" />
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
              </span>
              <RotatingText
                texts={["Web Developer", "UI/UX Designer", "Content Creator", "Graphic Designer", "Gamer"]}
                mainClassName="text-[10px] text-green-500 font-medium"
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
            </div>
          </div>
        </div>

        {/* Auth Button for Mobile */}
        <div className="shrink-0 flex items-center gap-2">
          <a
            href="https://drive.google.com/file/d/1FrVRyBK6ipSknWWiitO170wY0bSlkaDn/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            <PiDownload className="size-3.5" />
            <span>CV</span>
          </a>
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-2.5 py-1.5 rounded-xl hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <PiSignOut className="size-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <PiSignIn className="size-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* --- MOBILE FLOATING BOTTOM DOCK --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex lg:hidden bg-neutral-950/85 backdrop-blur-xl border border-neutral-800/90 rounded-full px-2 py-1.5 shadow-2xl items-center gap-0.5 max-w-[95vw] w-fit">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-300 relative ${isActive ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "text-neutral-400 hover:text-neutral-200 border border-transparent"
                }`}
            >
              {item.icon}
              {isActive && (
                <span className="text-[10px] font-bold tracking-tight uppercase pr-0.5 hidden sm:inline">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden lg:flex flex-col gap-6 items-center w-full sticky top-8 h-fit">
        <div className="flex flex-col items-center gap-3 w-full">
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
          {/* Download CV Button for Desktop */}
          <div className="w-full px-2">
            <a
              href="https://drive.google.com/file/d/1FrVRyBK6ipSknWWiitO170wY0bSlkaDn/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer font-medium hover:border-emerald-500/50 active:scale-95 text-center"
            >
              <PiDownload className="size-4" />
              <span>Download CV</span>
            </a>
          </div>
        </section>


        <hr className="w-full border-neutral-700" />

        {/* Auth Button for Desktop */}
        <div className="w-full px-2">
          {user ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-neutral-800/20 border border-neutral-800/50">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="size-6 rounded-full" alt="Avatar" />
                ) : (
                  <div className="size-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                    {user.email?.[0]}
                  </div>
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] font-medium text-neutral-300 truncate">{user.user_metadata?.full_name || user.email}</span>
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">{isAdmin ? "Admin" : "User"}</span>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center justify-center gap-2 w-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs py-2 px-4 rounded-xl hover:bg-red-500/25 transition-colors cursor-pointer"
              >
                <PiSignOut className="size-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-2 w-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-750 text-neutral-200 text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer font-medium hover:border-neutral-600 active:scale-95"
            >
              <PiSignIn className="size-4" />
              <span>Login with Google</span>
            </button>
          )}
        </div>

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

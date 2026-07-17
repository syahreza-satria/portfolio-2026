import { DiPhotoshop } from "react-icons/di";
import { FaPython } from "react-icons/fa";
import { RiDeepseekFill, RiOpenaiFill } from "react-icons/ri";
import {
  SiCanvas,
  SiCss,
  SiDaisyui,
  SiDart,
  SiFigma,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGoogledocs,
  SiGooglegemini,
  SiGooglesheets,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMui,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPhp,
  SiReact,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiVite,
  SiAnthropic,
} from "react-icons/si";

export const skillset = [
  // --- Frontend ---
  { id: 1, name: "HTML", category: "Frontend", icon: <SiHtml5 className="size-5 text-orange-500" />, bgClass: "bg-orange-500/30" },
  { id: 2, name: "CSS", category: "Frontend", icon: <SiCss className="size-5 text-blue-500" />, bgClass: "bg-blue-500/30" }, // Menggunakan SiCss3
  { id: 3, name: "Javascript", category: "Frontend", icon: <SiJavascript className="size-5 text-yellow-400" />, bgClass: "bg-yellow-400/20" },
  { id: 4, name: "React", category: "Frontend", icon: <SiReact className="size-5 text-cyan-400" />, bgClass: "bg-cyan-400/20" },
  { id: 5, name: "Next.js", category: "Frontend", icon: <SiNextdotjs className="size-5 text-white" />, bgClass: "bg-neutral-700/50" },
  { id: 6, name: "Tailwind CSS", category: "Frontend", icon: <SiTailwindcss className="size-5 text-teal-400" />, bgClass: "bg-teal-400/30" },
  { id: 7, name: "Daisy UI", category: "Frontend", icon: <SiDaisyui className="size-5 text-teal-400" />, bgClass: "bg-teal-400/30" },
  { id: 8, name: "Material UI", category: "Frontend", icon: <SiMui className="size-5 text-blue-500" />, bgClass: "bg-blue-500/30" },
  { id: 9, name: "Shadcn UI", category: "Frontend", icon: <SiShadcnui className="size-5 text-neutral-200" />, bgClass: "bg-neutral-600/30" },
  { id: 10, name: "Vite", category: "Frontend", icon: <SiVite className="size-5 text-purple-500" />, bgClass: "bg-purple-500/30" },

  // --- Backend ---
  { id: 11, name: "PHP", category: "Backend", icon: <SiPhp className="size-5 text-indigo-400" />, bgClass: "bg-indigo-400/30" },
  { id: 12, name: "Laravel", category: "Backend", icon: <SiLaravel className="size-5 text-red-500" />, bgClass: "bg-red-500/30" },
  { id: 13, name: "Node.js", category: "Backend", icon: <SiNodedotjs className="size-5 text-green-500" />, bgClass: "bg-green-500/30" },
  { id: 14, name: "Python", category: "Backend", icon: <FaPython className="size-5 text-blue-400" />, bgClass: "bg-blue-400/30" },

  // --- Database ---
  { id: 15, name: "MySQL", category: "Database", icon: <SiMysql className="size-5 text-blue-500" />, bgClass: "bg-blue-500/30" },
  { id: 16, name: "Supabase", category: "Database", icon: <SiSupabase className="size-5 text-emerald-500" />, bgClass: "bg-emerald-500/30" },

  // --- Tools ---
  { id: 17, name: "Git", category: "Tools", icon: <SiGit className="size-5 text-orange-500" />, bgClass: "bg-orange-500/30" },
  { id: 18, name: "Github", category: "Tools", icon: <SiGithub className="size-5 text-neutral-200" />, bgClass: "bg-neutral-600/30" },
  { id: 19, name: "NPM", category: "Tools", icon: <SiNpm className="size-5 text-red-500" />, bgClass: "bg-red-500/30" },
  { id: 25, name: "Google Docs", category: "Tools", icon: <SiGoogledocs className="size-5 text-blue-500" />, bgClass: "bg-blue-500/20" },
  { id: 26, name: "Google Sheets", category: "Tools", icon: <SiGooglesheets className="size-5 text-green-500" />, bgClass: "bg-green-500/20" },
  { id: 24, name: "Gemini", category: "Tools", icon: <SiGooglegemini className="size-5 text-indigo-400" />, bgClass: "bg-indigo-400/20" },
  { id: 28, name: "ChatGPT", category: "Tools", icon: <RiOpenaiFill className="size-5 text-emerald-500" />, bgClass: "bg-emerald-500/20" },
  { id: 29, name: "Claude", category: "Tools", icon: <SiAnthropic className="size-5 text-orange-400" />, bgClass: "bg-orange-500/25" },
  { id: 30, name: "DeepSeek", category: "Tools", icon: <RiDeepseekFill className="size-5 text-blue-500" />, bgClass: "bg-blue-500/20" },

  // --- Mobile Development ---
  { id: 20, name: "Dart", category: "Mobile Development", icon: <SiDart className="size-5 text-cyan-500" />, bgClass: "bg-cyan-500/30" },
  { id: 21, name: "Flutter", category: "Mobile Development", icon: <SiFlutter className="size-5 text-sky-400" />, bgClass: "bg-sky-400/30" },

  // --- Design ---
  { id: 22, name: "Figma", category: "Design", icon: <SiFigma className="size-5 text-pink-500" />, bgClass: "bg-pink-500/30" },
  { id: 23, name: "Adobe Photoshop", category: "Design", icon: <DiPhotoshop className="size-5 text-blue-600" />, bgClass: "bg-blue-600/30" },
  { id: 27, name: "Canva", category: "Design", icon: <SiCanvas className="size-5 text-purple-400" />, bgClass: "bg-purple-500/20" },
];

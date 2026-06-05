import { DiPhotoshop } from "react-icons/di";
import { FaPython } from "react-icons/fa";
import {
  SiCss,
  SiDaisyui,
  SiDart,
  SiFigma,
  SiFlutter,
  SiGit,
  SiGithub,
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

  // --- Mobile Development ---
  { id: 20, name: "Dart", category: "Mobile Development", icon: <SiDart className="size-5 text-cyan-500" />, bgClass: "bg-cyan-500/30" },
  { id: 21, name: "Flutter", category: "Mobile Development", icon: <SiFlutter className="size-5 text-sky-400" />, bgClass: "bg-sky-400/30" },

  // --- Design ---
  { id: 22, name: "Figma", category: "Design", icon: <SiFigma className="size-5 text-pink-500" />, bgClass: "bg-pink-500/30" },
  { id: 23, name: "Adobe Photoshop", category: "Design", icon: <DiPhotoshop className="size-5 text-blue-600" />, bgClass: "bg-blue-600/30" },
];

export const educations = [
  {
    id: 2,
    logo: "/images/sman4kendari-logo.png",
    school: "SMA Negeri 4 Kendari",
    title: "Senior Highschool",
    major: "Science",
    gpa: null,
    startDate: "Aug 2020",
    endDate: "Sep 2024",
    location: "Bandung, Indonesia",
  },
  {
    id: 1,
    logo: "/images/telkom-university-logo.png",
    school: "Telkom University",
    title: "Bachelor's Degree",
    major: "Information Technology (S. Kom)",
    gpa: "3.29",
    startDate: "Aug 2020",
    endDate: "Sep 2024",
    location: "Bandung, Indonesia",
  },
];

export const experiences = [
  {
    id: 4,
    logo: "/images/mc-logo.png",
    role: "Graphic Design",
    company: "Marketing Crew Telkom University",
    location: "Bandung, Indonesia",
    startDate: "Nov 2022",
    endDate: "Dec 2024",
    duration: "3 month",
    type: "Part-Time",
    setup: "Hybrid",
    responsibilities: [
      "Developed and implemented comprehensive visual strategies designed to increase engagement and visibility across various social media platforms.",
      "Collaborated with the content team to translate creative briefs into 20+ engaging social media visual assets using Figma, ensuring alignment with target audience preferences.",
      "Expanded design contributions beyond digital platforms by conceptualizing and producing print-ready physical assets, including official marketing team ID cards and lanyards.",
      "Maintained strict attention to detail and high creative standards across both digital and print outputs to ensure consistent and professional brand representation.",
    ],
  },
  {
    id: 3,
    logo: "/images/caatis-logo.png",
    role: "Information Technology Lead",
    company: "Lakeside F&B Group",
    location: "Bandung, Indonesia",
    startDate: "Sep 2024",
    endDate: "Jan 2025",
    duration: "3 month",
    type: "Part-Time",
    setup: "Hybrid",
    responsibilities: [
      "Led and mentored a distributed team of 8 IT students, effectively delegating tasks and managing workflows to ensure the timely delivery of technical upgrades.",
      "Spearheaded the UI/UX redesign and functional enhancements of three existing core web applications: the in-store POS System, the Mobile Web-App, and the StockApp inventory tool.",
      "Improved system usability and operational efficiency by optimizing existing features and resolving functionality issues within the applications.",
      "Collaborated with stakeholders to identify pain points in the previous versions and translated them into actionable, technically sound digital improvements.",
    ],
  },
  {
    id: 2,
    logo: "/images/lac-logo.png",
    role: "IT Support Coordinator",
    company: "Language Center Telkom University",
    location: "Bandung, Indonesia",
    startDate: "Oct 2025",
    endDate: "Dec 2025",
    duration: "3 month",
    type: "Freelance",
    setup: "Hybrid",
    responsibilities: [
      "Led a team of 6 IT Support staff to manage the technical preparation and execution of the English Proficiency Test (EPrT) for incoming freshmen.",
      "Trained and mentored IT Support team members on standard troubleshooting procedures to effectively resolve system and device issues.",
      "Provided real-time, hands-on technical assistance to troubleshoot and resolve participants' laptop, software, or network disruptions during the exam.",
      "Managed post-exam administrative duties, ensuring the accurate completion of daily logbooks and Official Handover Protocols (Berita Acara Pelaksanaan/BAP).",
      "Demonstrated operational flexibility by alternating roles as a Proctor or Co-Proctor to verify participant identities and monitor academic integrity.",
    ],
  },
  {
    id: 1,
    logo: "/images/lac-logo.png",
    role: "IT Support",
    company: "Language Center Telkom University",
    location: "Bandung, Indonesia",
    startDate: "Feb 2026",
    endDate: "Present",
    duration: "2 month",
    type: "Internship",
    setup: "Hybrid",
    responsibilities: [
      "Independently managed end-to-end technical support for regular English Proficiency Test (EPrT) sessions, successfully facilitating both on-site and remote (Zoom-based) examinations.",
      "Guided candidates in installing and configuring the Safe Exam Browser (SEB), ensuring all personal devices strictly met academic testing standards.",
      "Delivered real-time troubleshooting to resolve hardware, software, and network disruptions across both physical and virtual testing environments.",
      "Performed dual roles as Proctor and Co-Proctor, rigorously verifying participant identities and monitoring academic integrity during assigned shifts.",
    ],
  },
];

export const achievement = [
  {
    id: 2,
    credentialId: "22313141341233",
    title: "Testing Sertifikat Part 2",
    organizer: "Udemy / Tech Academy",
    image: "/images/certificate.jpg",
    type: "Course",
    category: "Web Development",
    issuedDate: "JULY 2025",
  },
  {
    id: 1,
    credentialId: "22313141341233",
    title: "Full-Stack Web Development Masterclass",
    organizer: "Udemy / Tech Academy",
    image: "/images/certificate.jpg",
    type: "Course",
    category: "Web Development",
    issuedDate: "JULY 2025",
  },
];

export const gears = [
  {
    id: 2,
    brand: "Vortexseries",
    model: "Mono 75",
    image: "/images/vortexseries-mono75.jpg",
    category: "Video",
    description: "Budget mechanical keyboard with soothing sound.",
    link: "https://tk.tokopedia.com/ZSQ8TUBYF/",
  },
  {
    id: 1,
    brand: "Asus",
    model: "Gaming V16",
    image: "/images/asus-v16.jpg",
    category: "Computer",
    description: "Good budget gaming laptop.",
    link: "https://tk.tokopedia.com/ZSQ83jYbH/",
  },
];

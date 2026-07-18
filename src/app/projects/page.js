"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import SideNav from "../../components/custom/SideNav";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { ArrowUpRight, Plus, Edit, Trash2, ListFilter, Calendar, ArrowUpDown } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { child, parent } from "@/constants/animation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";

const getStatusConfig = (status) => {
  const s = String(status || "").toLowerCase();
  
  if (s === "live" || s === "true") {
    return {
      text: "Live",
      dotClass: "bg-emerald-500 animate-pulse",
      badgeClass: "border-emerald-500/25 text-emerald-400 bg-emerald-500/10"
    };
  }
  
  if (s === "in progress" || s === "false" || s === "") {
    return {
      text: "In Progress",
      dotClass: "bg-sky-500 animate-pulse",
      badgeClass: "border-sky-500/25 text-sky-400 bg-sky-500/10"
    };
  }
  
  if (s === "completed") {
    return {
      text: "Completed",
      dotClass: "bg-indigo-400",
      badgeClass: "border-indigo-500/25 text-indigo-400 bg-indigo-500/10"
    };
  }
  
  if (s === "design phase") {
    return {
      text: "Design Phase",
      dotClass: "bg-rose-400",
      badgeClass: "border-rose-500/25 text-rose-400 bg-rose-500/10"
    };
  }
  
  if (s === "concept") {
    return {
      text: "Concept",
      dotClass: "bg-amber-400",
      badgeClass: "border-amber-500/25 text-amber-400 bg-amber-500/10"
    };
  }
  
  if (s === "maintenance") {
    return {
      text: "Maintenance",
      dotClass: "bg-yellow-500 animate-pulse",
      badgeClass: "border-yellow-500/25 text-yellow-400 bg-yellow-500/10"
    };
  }
  
  if (s === "archived") {
    return {
      text: "Archived",
      dotClass: "bg-neutral-500",
      badgeClass: "border-neutral-700 text-neutral-400 bg-neutral-900/60"
    };
  }
  
  return {
    text: status,
    dotClass: "bg-neutral-500",
    badgeClass: "border-neutral-700 text-neutral-400 bg-neutral-900/60"
  };
};

const flipCardVariants = {
  hidden: {
    opacity: 0,
    rotateY: -90,
    transformPerspective: 1000,
  },
  show: (index) => ({
    opacity: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 70,
      delay: index * 0.08,
    },
  }),
};

export default function Projects() {
  const router = useRouter();

  // --- 1. State Management ---
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const { user, isAdmin } = useAuth();

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  // --- 2. Fetch Data ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("project_date", { ascending: false, nullsFirst: false })
          .order("id", { ascending: false });

        if (error) throw error;

        // Mapping data untuk memastikan snake_case dari DB cocok dengan camelCase di UI
        const formattedData = data.map((item) => ({
          ...item,
          demoLink: item.demo_link, // Menyesuaikan pemanggilan project.demoLink di JSX
        }));

        setProjects(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- 3. Filter Logic ---
  const uniqueTypes = ["All", ...new Set(projects.map((item) => item.type))];
  const uniqueCategories = ["All", ...new Set(projects.map((item) => item.category))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || project.type === selectedType;
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dateA = a.project_date ? new Date(a.project_date) : new Date(0);
    const dateB = b.project_date ? new Date(b.project_date) : new Date(0);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // --- 4. Tampilan Loading & Error (Tetap menjaga layout utama) ---
  // Memindahkan early return ke bagian dalam render agar SideNav tidak hilang saat loading
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {/* Header skeletons */}
          <div className="space-y-2.5 animate-pulse">
            <div className="h-4 w-40 bg-neutral-800/60 rounded-md" />
            <div className="h-4.5 w-48 bg-neutral-800/60 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-0 flex flex-col gap-3 h-[420px]">
                {/* Image Placeholder */}
                <div className="w-full aspect-video rounded-t-3xl bg-neutral-800/50" />
                {/* Info Placeholders */}
                <div className="px-5 py-3 flex flex-col grow gap-4">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-1/2 bg-neutral-800/60 rounded-md" />
                    <div className="h-5 w-16 bg-neutral-800/60 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-neutral-800/40 rounded-md" />
                    <div className="h-4 w-5/6 bg-neutral-800/40 rounded-md" />
                  </div>
                  <div className="h-3 w-1/3 bg-neutral-800/30 rounded-md mt-1" />
                  <div className="mt-auto pt-5 pb-2">
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 w-16 bg-neutral-800/50 rounded-full" />
                      <div className="h-5 w-20 bg-neutral-800/50 rounded-full" />
                    </div>
                    <hr className="border-neutral-800/80 mb-3" />
                    <div className="flex justify-between">
                      <div className="h-3 w-12 bg-neutral-800/40 rounded" />
                      <div className="h-3 w-16 bg-neutral-800/40 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">Error: {error}</div>;
    }

    return (
      <>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
            <Input
              type="text"
              placeholder="Search projects..."
              className="bg-neutral-800 border-neutral-700 w-full sm:max-w-xs text-neutral-200 focus-visible:ring-emerald-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-md text-sm text-neutral-200 hover:bg-neutral-700 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <ListFilter className="size-4" />
                  {selectedType === "All" ? "Filter Type" : `Type: ${selectedType}`}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200 min-w-[200px]">
                  <DropdownMenuLabel className="text-neutral-400">Project Type</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  {uniqueTypes.map((type) => (
                    <DropdownMenuCheckboxItem key={type} checked={selectedType === type} onCheckedChange={() => setSelectedType(type)} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                      {type === "All" ? "All Types" : type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-md text-sm text-neutral-200 hover:bg-neutral-700 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <ArrowUpDown className="size-4" />
                  {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200 min-w-[180px]">
                  <DropdownMenuLabel className="text-neutral-400">Sort by Date</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuCheckboxItem checked={sortOrder === "desc"} onCheckedChange={() => setSortOrder("desc")} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                    Newest First
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={sortOrder === "asc"} onCheckedChange={() => setSortOrder("asc")} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                    Oldest First
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-neutral-800/40 border border-neutral-700/50 p-1 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:w-fit mx-auto rounded-lg gap-1 whitespace-nowrap justify-start md:justify-center">
              {uniqueCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white data-[state=active]:shadow-sm text-neutral-400 rounded-md px-4 py-1.5 text-sm transition-all cursor-pointer shrink-0"
                >
                  {category === "All" ? "All Categories" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <p className="text-neutral-400 font-medium text-sm">Showing {sortedProjects.length} projects</p>

        <motion.div layout="position" className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((project, index) => (
              <motion.div
                layout
                variants={flipCardVariants}
                custom={index}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } }}
                key={project.id}
                className="h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Perbaikan Typo: p-0! menjadi !p-0 */}
                <SpotlightCard
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="custom-spotlight-card !p-0 flex flex-col rounded-3xl h-full group relative cursor-pointer hover:border-neutral-700/80 transition-all duration-300 bg-neutral-900/30 border border-neutral-800/60 shadow-lg"
                  spotlightColor="rgba(0, 229, 255, 0.15)"
                >
                  {/* Floating Live/In-Dev Status Badge */}
                  <div className="absolute top-3 left-3 z-20 flex gap-2">
                    {(() => {
                      const config = getStatusConfig(project.status);
                      return (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-md ${config.badgeClass}`}>
                          <span className={`size-1.5 rounded-full ${config.dotClass}`}></span>
                          {config.text}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/projects/${project.id}/edit`);
                        }}
                        className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80 backdrop-blur-md transition-all cursor-pointer active:scale-90"
                        title="Edit Project"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, project.id)}
                        className="p-2 rounded-full bg-neutral-900/80 hover:bg-red-950/80 text-neutral-300 hover:text-red-400 border border-neutral-800/80 hover:border-red-900/50 backdrop-blur-md transition-all cursor-pointer active:scale-90"
                        title="Delete Project"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Banner */}
                  <div className="relative w-full aspect-video rounded-t-3xl overflow-hidden border-b border-neutral-800/60 bg-neutral-950/50">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        loading={index < 2 ? "eager" : "lazy"}
                        priority={index < 2}
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        sizes="(max-w-7xl) 33vw, 100vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>

                  {/* Info Details Content */}
                  <div className="px-5 py-5 flex flex-col grow gap-3">
                    
                    {/* Meta Badges Row */}
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 bg-neutral-800/60 border border-neutral-700/50 px-2 py-0.5 rounded">
                        {project.type}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {project.category}
                      </span>
                    </div>

                    {/* Title & Date */}
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-base sm:text-lg md:text-xl tracking-tight leading-snug line-clamp-1 group-hover:text-emerald-400 transition-colors duration-200" title={project.title}>
                        {project.title}
                      </h3>
                      {project.project_date && (
                        <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                          <Calendar className="size-3.5" />
                          <span>
                            {new Date(project.project_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    {project.role && (
                      <p className="text-neutral-400 text-xs font-medium line-clamp-1">
                        <span className="text-neutral-500">Role:</span> {project.role}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-neutral-300/90 text-xs sm:text-sm leading-relaxed line-clamp-2">{project.description}</p>

                    {/* Tech Stack Pills */}
                    {project.techstack && project.techstack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techstack.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850/80 px-2 py-0.5 rounded-md font-mono">
                            {tech}
                          </span>
                        ))}
                        {project.techstack.length > 3 && (
                          <span className="text-[10px] text-neutral-500 px-1 py-0.5 font-mono">
                            +{project.techstack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions Footer */}
                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between w-full mt-auto">
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors duration-300 group/github font-semibold"
                        >
                          <SiGithub className="size-4" />
                          <span>Source</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-neutral-600 font-medium italic">Private Repo</span>
                      )}

                      {project.demoLink ? (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-0.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors duration-300 group/link"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-neutral-600 font-medium">Demo Unavailable</span>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {sortedProjects.length === 0 && <div className="w-full text-center py-12 text-neutral-500 bg-neutral-900/20 rounded-xl border border-neutral-800 border-dashed">No projects found matching your criteria.</div>}
      </>
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 lg:col-span-9 w-full space-y-6 pb-16">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tighter">Projects</h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A curated collection of web applications and design projects, showcasing my expertise in building scalable solutions and intuitive user experiences.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push("/projects/create")}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-600/10 active:scale-95"
            >
              <Plus className="size-4" />
              <span>Add Project</span>
            </button>
          )}
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="space-y-6">{renderContent()}</section>
      </motion.div>
    </div>
  );
}

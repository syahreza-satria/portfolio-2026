"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import SideNav from "../../components/custom/SideNav";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowUpRight, Plus, Edit, Trash2, ListFilter, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { child, parent } from "../../../animation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth";
import CrudModal from "@/components/custom/CrudModal";

export default function Projects() {
  // --- 1. State Management ---
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State yang sebelumnya hilang untuk Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { user, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);

  const projectFields = [
    { name: "title", label: "Project Title", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "image", label: "Project Image", type: "image", required: false },
    { name: "type", label: "Project Type", type: "select", options: ["Web App", "Mobile App", "Design", "Library", "Other"], required: true },
    { name: "category", label: "Category", type: "select", options: ["Full-Stack Web", "UI/UX Design", "Mobile Development", "Frontend", "Backend", "AI / ML"], required: true },
    { name: "techstack", label: "Tech Stack (comma-separated)", type: "array", required: false },
    { name: "demoLink", label: "Live Demo URL", required: false },
    { name: "github", label: "GitHub URL", required: false },
    { name: "status", label: "Status (Live)", type: "switch", description: "Is this project live?", required: false },
  ];

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  };

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

  const handleSave = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      type: formData.type,
      category: formData.category,
      techstack: formData.techstack || [],
      demo_link: formData.demoLink,
      github: formData.github,
      status: !!formData.status,
    };

    if (editingProject) {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id)
        .select();
      if (error) throw error;

      const returnedRow = (data && data.length > 0) ? data[0] : { ...editingProject, ...payload, demo_link: payload.demo_link };
      const formatted = { ...returnedRow, demoLink: returnedRow.demo_link };
      setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? formatted : p)));
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert([payload])
        .select();
      if (error) throw error;

      const returnedRow = (data && data.length > 0) ? data[0] : { id: Date.now(), ...payload, demo_link: payload.demo_link };
      const formatted = { ...returnedRow, demoLink: returnedRow.demo_link };
      setProjects((prev) => [formatted, ...prev]);
    }
  };

  // --- 2. Fetch Data ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });

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

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 md:gap-6 animate-pulse">
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

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center sm:justify-start gap-2 bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-md text-sm text-neutral-200 hover:bg-neutral-700 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
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

        <p className="text-neutral-400 font-medium text-sm">Showing {filteredProjects.length} projects</p>

        <motion.div layout="position" className="grid grid-cols-2 md:grid-cols-2 gap-2.5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {[...filteredProjects].map((project) => (
              <motion.div
                layout
                variants={child}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } }}
                key={project.id}
                className="h-full"
              >
                {/* Perbaikan Typo: p-0! menjadi !p-0 */}
                <SpotlightCard
                  onClick={() => setPreviewProject(project)}
                  className="custom-spotlight-card !p-0 flex flex-col gap-3 rounded-3xl h-full group relative cursor-pointer hover:border-neutral-700 transition-all duration-300"
                  spotlightColor="rgba(0, 229, 255, 0.15)"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex gap-2">
                      <button
                        onClick={(e) => handleOpenEdit(e, project)}
                        className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur transition-all cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, project.id)}
                        className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-red-950/80 text-neutral-300 hover:text-red-405 border border-neutral-800 hover:border-red-900 backdrop-blur transition-all cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="relative w-full aspect-video rounded-t-3xl overflow-hidden border-b border-neutral-700/50 bg-neutral-900/50">
                    {project.image && <Image src={project.image} alt={project.title} fill loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-w-7xl) 33vw, 100vw" />}
                  </div>

                  <div className="px-3 py-2.5 sm:px-5 sm:py-3 flex flex-col grow">
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                        <h3 className="text-white font-medium text-xs sm:text-base md:text-lg tracking-tight leading-snug line-clamp-1" title={project.title}>
                          {project.title}
                        </h3>

                        <div
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border whitespace-nowrap ${project.status ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-neutral-500/30 text-neutral-400 bg-neutral-500/10"
                            }`}
                        >
                          <span className={`size-1 sm:size-1.5 rounded-full ${project.status ? "bg-emerald-500 animate-pulse" : "bg-neutral-500"}`}></span>
                          {project.status ? "Live" : "Not Live"}
                        </div>
                      </div>

                      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-2">{project.description}</p>

                      {project.techstack && project.techstack.length > 0 && <p className="text-neutral-500 text-[10px] sm:text-xs mt-1 font-mono line-clamp-1 text-ellipsis">{project.techstack.join(" • ")}</p>}
                    </div>

                    <div className="mt-auto flex flex-col pt-3 sm:pt-5 pb-1 sm:pb-2">
                      <div className="flex w-full flex-wrap justify-start gap-1 sm:gap-2 mb-3 sm:mb-4">
                        <Badge variant="secondary" className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 bg-neutral-800 text-neutral-300 border-neutral-700">
                          {project.type}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 bg-neutral-800 text-neutral-300 border-neutral-700">
                          {project.category}
                        </Badge>
                      </div>

                      <div>
                        <hr className="border-neutral-700/80 mb-2 sm:mb-3" />

                        <div className="flex items-center justify-between w-full gap-2">
                          {project.github ? (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 sm:gap-1.5 text-neutral-400 hover:text-white transition-colors duration-300 group/github"
                            >
                              <SiGithub className="size-3 sm:size-3.5" />
                              <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider sm:tracking-widest uppercase">Source</span>
                            </a>
                          ) : (
                            <div />
                          )}

                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-0.5 sm:gap-1 text-emerald-500 hover:text-emerald-400 transition-colors duration-300 group/link"
                            >
                              <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider sm:tracking-widest uppercase">Live Demo</span>
                              <ArrowUpRight className="size-3 sm:size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && <div className="w-full text-center py-12 text-neutral-500 bg-neutral-900/20 rounded-xl border border-neutral-800 border-dashed">No projects found matching your criteria.</div>}
      </>
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 lg:col-span-9 w-full space-y-6 pb-16">
        <section className="flex justify-between items-center gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tighter">Projects</h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed">A curated collection of web applications and design projects, showcasing my expertise in building scalable solutions and intuitive user experiences.</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-600/10 active:scale-95"
            >
              <Plus className="size-4" />
              <span>Add Project</span>
            </button>
          )}
        </section>

        <hr className="border-neutral-500 border-dashed" />

        <section className="space-y-6">{renderContent()}</section>

        <CrudModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject ? "Edit Project" : "Add Project"}
          onSubmit={handleSave}
          initialData={editingProject}
          fields={projectFields}
        />

        {/* Project Preview Lightbox / Details Modal */}
        <AnimatePresence>
          {previewProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setPreviewProject(null)}
                className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative bg-neutral-900 border border-neutral-805 rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row max-h-[90vh] md:h-[550px]"
              >
                {/* Close Button (Floating Top Right of Card for easier tap/click) */}
                <button
                  onClick={() => setPreviewProject(null)}
                  className="absolute top-4 right-4 z-40 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                >
                  <X className="size-4" />
                </button>

                {/* Left Side: Image Preview */}
                <div className="w-full md:w-[55%] bg-neutral-950 flex items-center justify-center relative h-[250px] md:h-full overflow-hidden group/image">
                  {previewProject.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewProject.image}
                        alt={previewProject.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                        sizes="(max-w-4xl) 55vw, 100vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/20 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-neutral-500 flex flex-col items-center gap-3 w-full h-full justify-center">
                      <ListFilter className="size-16 text-neutral-800" />
                      <span>No project image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Right Side: Details Info */}
                <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-neutral-900 relative border-t md:border-t-0 md:border-l border-neutral-800/80">
                  <div className="space-y-6">
                    {/* Header: Title and Badges */}
                    <div className="space-y-3 pr-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {previewProject.type}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 bg-neutral-800 border border-neutral-700/80 px-2 py-0.5 rounded-md">
                          {previewProject.category}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                        {previewProject.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${previewProject.status ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : "border-neutral-500/20 text-neutral-400 bg-neutral-800"
                          }`}>
                          <span className={`size-1.5 rounded-full ${previewProject.status ? "bg-emerald-500 animate-pulse" : "bg-neutral-500"}`}></span>
                          {previewProject.status ? "Live Project" : "In Development"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Description</span>
                      <p className="text-neutral-300 text-sm leading-relaxed max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                        {previewProject.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    {previewProject.techstack && previewProject.techstack.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Tech Stack</span>
                        <div className="flex flex-wrap gap-1.5">
                          {previewProject.techstack.map((tech) => (
                            <span key={tech} className="text-xs bg-neutral-950 text-neutral-300 border border-neutral-800/80 px-2.5 py-1 rounded-lg font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-8 pt-4 border-t border-neutral-850 flex gap-3">
                    {previewProject.github && (
                      <a
                        href={previewProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-all text-sm font-medium border border-neutral-800 cursor-pointer active:scale-98"
                      >
                        <SiGithub className="size-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {previewProject.demoLink && (
                      <a
                        href={previewProject.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-sm font-medium cursor-pointer shadow-lg shadow-emerald-600/10 active:scale-95"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

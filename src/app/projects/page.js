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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
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
            <TabsList className="bg-neutral-800/40 border border-neutral-700/50 p-1 flex flex-wrap h-auto justify-center w-full md:w-fit mx-auto rounded-lg">
              {uniqueCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white data-[state=active]:shadow-sm text-neutral-400 rounded-md px-4 py-1.5 text-sm transition-all cursor-pointer"
                >
                  {category === "All" ? "All Categories" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <p className="text-neutral-400 font-medium text-sm">Showing {filteredProjects.length} projects</p>

        <motion.div layout="position" className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="px-5 py-3 flex flex-col grow">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-white font-medium text-lg tracking-tight leading-snug line-clamp-1" title={project.title}>
                          {project.title}
                        </h3>

                        <div
                          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${project.status ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-neutral-500/30 text-neutral-400 bg-neutral-500/10"
                            }`}
                        >
                          <span className={`size-1.5 rounded-full ${project.status ? "bg-emerald-500 animate-pulse" : "bg-neutral-500"}`}></span>
                          {project.status ? "Live" : "Not Live"}
                        </div>
                      </div>

                      <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>

                      {project.techstack && project.techstack.length > 0 && <p className="text-neutral-500 text-xs mt-1 font-mono line-clamp-1 text-ellipsis">{project.techstack.join(" • ")}</p>}
                    </div>

                    <div className="mt-auto flex flex-col pt-5 pb-2">
                      <div className="flex w-full flex-wrap justify-start gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                          {project.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-300 border-neutral-700">
                          {project.category}
                        </Badge>
                      </div>

                      <div>
                        <hr className="border-neutral-700/80 mb-3" />

                        <div className="flex items-center justify-between w-full">
                          {project.github ? (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-300 group/github"
                            >
                              <SiGithub className="size-3.5" />
                              <span className="text-[11px] font-semibold tracking-widest uppercase">Source</span>
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
                              className="flex items-center gap-1 text-emerald-500 hover:text-emerald-400 transition-colors duration-300 group/link"
                            >
                              <span className="text-[11px] font-semibold tracking-widest uppercase">Live Demo</span>
                              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
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
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 px-4 sm:px-6">
      <SideNav />

      <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="col-span-1 sm:col-span-9 w-full space-y-6 pb-16">
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
                className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ y: 80, opacity: 0, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 28,
                  exit: { type: "tween", ease: "easeIn", duration: 0.2 }
                }}
                className="relative bg-[#18181b] border border-neutral-850 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:h-[500px]"
              >
                {/* Left Side: Image Preview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                  className="w-full md:w-[60%] bg-[#1c1c1c] flex items-center justify-center relative min-h-[250px] md:min-h-0"
                >
                  {previewProject.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewProject.image}
                        alt={previewProject.title}
                        fill
                        className="object-cover"
                        sizes="(max-w-5xl) 60vw, 100vw"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-neutral-500 flex flex-col items-center gap-3 w-full bg-neutral-900 h-full justify-center">
                      <ListFilter className="size-16 text-neutral-800" />
                      <span>No project image uploaded</span>
                    </div>
                  )}
                </motion.div>

                {/* Right Side: Details Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                  className="w-full md:w-[40%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#18181b] relative border-t md:border-t-0 md:border-l border-neutral-800"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setPreviewProject(null)}
                    className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-neutral-950/60 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>

                  <div className="space-y-6">
                    {/* Title and Badges */}
                    <div className="pr-6 space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{previewProject.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-[10px] bg-neutral-800 text-neutral-300 border-neutral-700">
                          {previewProject.type}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] bg-neutral-800 text-neutral-300 border-neutral-700">
                          {previewProject.category}
                        </Badge>
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            previewProject.status ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-neutral-500/30 text-neutral-400 bg-neutral-500/10"
                          }`}
                        >
                          <span className={`size-1 rounded-full ${previewProject.status ? "bg-emerald-500 animate-pulse" : "bg-neutral-500"}`}></span>
                          {previewProject.status ? "Live" : "Not Live"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Description</span>
                      <p className="text-neutral-300 text-sm leading-relaxed max-h-[160px] overflow-y-auto pr-1">{previewProject.description}</p>
                    </div>

                    {/* Tech Stack */}
                    {previewProject.techstack && previewProject.techstack.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Tech Stack</span>
                        <div className="flex flex-wrap gap-1.5">
                          {previewProject.techstack.map((tech) => (
                            <span key={tech} className="text-xs bg-neutral-850 text-neutral-300 border border-neutral-800 px-2.5 py-1 rounded-lg font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-8 pt-4 border-t border-neutral-800 flex gap-3">
                    {previewProject.github && (
                      <a
                        href={previewProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-755 text-neutral-200 hover:text-white transition-all text-sm font-medium border border-neutral-700/50 cursor-pointer"
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
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-sm font-medium cursor-pointer shadow-lg shadow-emerald-600/10 active:scale-95"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

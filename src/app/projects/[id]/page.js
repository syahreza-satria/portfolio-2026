"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SideNav from "../../../components/custom/SideNav";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { motion, AnimatePresence } from "motion/react";
import SpotlightCard from "@/components/SpotlightCard";
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

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const nextImage = (e) => {
    e.stopPropagation();
    if (project?.gallery?.length) {
      setActiveImageIndex((prev) => (prev + 1) % project.gallery.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (project?.gallery?.length) {
      setActiveImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetail = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setProject({
            ...data,
            demoLink: data.demo_link,
          });
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetail();
  }, [id]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          {/* Back button skeleton */}
          <div className="h-9 w-32 bg-neutral-800/60 rounded-xl" />
          
          {/* Image skeleton */}
          <div className="w-full aspect-video md:h-[400px] bg-neutral-800/60 rounded-[2rem]" />

          {/* Info skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-4">
              <div className="h-8 w-2/3 bg-neutral-800/60 rounded-md" />
              <div className="h-4 w-full bg-neutral-800/40 rounded-md" />
              <div className="h-4 w-full bg-neutral-800/40 rounded-md" />
              <div className="h-4 w-5/6 bg-neutral-800/40 rounded-md" />
            </div>
            <div className="md:col-span-4 space-y-4">
              <div className="h-6 w-1/3 bg-neutral-800/60 rounded-md" />
              <div className="h-10 w-full bg-neutral-800/50 rounded-xl" />
              <div className="h-10 w-full bg-neutral-800/50 rounded-xl" />
            </div>
          </div>
        </div>
      );
    }

    if (error || !project) {
      return (
        <div className="space-y-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Projects</span>
          </Link>
          <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
            {error ? `Error: ${error}` : "Project not found"}
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl border border-neutral-800 transition-all text-sm font-medium active:scale-95 shadow-sm"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Main Spotlight Card */}
        <SpotlightCard
          className="relative !p-0 overflow-hidden border border-neutral-800 rounded-[2rem] bg-neutral-900/40 shadow-2xl flex flex-col"
          spotlightColor="rgba(0, 229, 255, 0.08)"
        >
          {/* Main Visual Image Banner */}
          <div className="w-full overflow-hidden bg-neutral-950 border-b border-neutral-800/50 flex justify-center items-center">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-contain max-h-[600px]"
              />
            ) : (
              <div className="w-full h-48 flex flex-col items-center justify-center text-neutral-600 gap-3">
                <ExternalLink className="size-16 stroke-1 text-neutral-800" />
                <span>No project image available</span>
              </div>
            )}
          </div>

          {/* Details Content Container */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Side: General Info & Description */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                {/* Badges / Category / Role */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
                    {project.type}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 bg-neutral-800 border border-neutral-700/80 px-3 py-1 rounded-md">
                    {project.category}
                  </span>
                  {(() => {
                    const config = getStatusConfig(project.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${config.badgeClass}`}>
                        <span className={`size-1.5 rounded-full ${config.dotClass}`}></span>
                        {config.text}
                      </span>
                    );
                  })()}
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {project.title}
                </h1>

                {/* Role & Date Info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-400 text-sm">
                  {project.role && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 font-medium">My Role:</span>
                      <span className="text-neutral-200 font-semibold">{project.role}</span>
                    </div>
                  )}
                  {project.project_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-neutral-500" />
                      <span className="text-neutral-500 font-medium">Completed:</span>
                      <span className="text-neutral-200 font-semibold">
                        {new Date(project.project_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-neutral-800" />

              {/* Long Description */}
              <div className="space-y-3">
                <h3 className="text-sm text-neutral-400 uppercase font-bold tracking-wider">About the Project</h3>
                <p className="text-neutral-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm text-neutral-400 uppercase font-bold tracking-wider">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-neutral-300 text-sm md:text-base">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Details */}
              {project.techstack && project.techstack.length > 0 && (
                <div className="space-y-3.5">
                  <h3 className="text-sm text-neutral-400 uppercase font-bold tracking-wider">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techstack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs sm:text-sm bg-neutral-950 text-neutral-300 border border-neutral-800 px-3.5 py-1.5 rounded-xl font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm text-neutral-400 uppercase font-bold tracking-wider">Project Screenshots</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.gallery.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition-all duration-300 group cursor-pointer"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${project.title} Screenshot ${index + 1}`}
                          fill
                          loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-w-7xl) 33vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Links & Call To Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-950/50 border border-neutral-850 p-6 rounded-2xl space-y-6 sticky top-24">
                <h3 className="text-sm text-neutral-300 font-bold uppercase tracking-wider">Project Links</h3>
                
                <div className="flex flex-col gap-3">
                  {project.demoLink ? (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/10 cursor-pointer active:scale-98"
                    >
                      <span>Visit Live Demo</span>
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : (
                    <div className="w-full text-center py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 text-sm font-medium">
                      Demo Unavailable
                    </div>
                  )}

                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-medium text-sm transition-all border border-neutral-800 cursor-pointer active:scale-98"
                    >
                      <SiGithub className="size-4.5" />
                      <span>Explore Source Code</span>
                    </a>
                  ) : (
                    <div className="w-full text-center py-3 rounded-xl bg-neutral-900 border border-neutral-850 text-neutral-600 text-sm font-medium">
                      Repository is Private
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-900 text-center">
                  <span className="text-xs text-neutral-500 block">
                    Interested in similar projects? Let's connect!
                  </span>
                  <Link
                    href="/contact"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-block mt-2 transition-colors"
                  >
                    Get in Touch &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </SpotlightCard>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <div className="col-span-1 lg:col-span-9 w-full pb-16">
        {renderContent()}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && project?.gallery && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImageIndex(null)}
              className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md cursor-zoom-out"
            />

            {/* Container for content */}
            <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center z-10 select-none">
              {/* Close Button */}
              <button
                onClick={() => setActiveImageIndex(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Close"
              >
                <X className="size-5" />
              </button>

              {/* Prev Button */}
              {project.gallery.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute -left-4 md:-left-16 p-3 rounded-full bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95 z-20"
                  title="Previous"
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}

              {/* Image */}
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-full max-h-[80vh] aspect-video w-full"
              >
                <img
                  src={project.gallery[activeImageIndex]}
                  alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain rounded-2xl border border-neutral-800"
                />
              </motion.div>

              {/* Next Button */}
              {project.gallery.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute -right-4 md:-right-16 p-3 rounded-full bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95 z-20"
                  title="Next"
                >
                  <ChevronRight className="size-6" />
                </button>
              )}
            </div>

            {/* Bottom Info Bar */}
            <div className="z-10 mt-4 text-center">
              <span className="text-neutral-400 text-xs tracking-widest uppercase font-semibold">
                Image {activeImageIndex + 1} of {project.gallery.length}
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

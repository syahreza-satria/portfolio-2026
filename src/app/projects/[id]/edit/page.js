"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import SideNav from "@/components/custom/SideNav";
import ProjectForm from "@/components/custom/ProjectForm";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function EditProject() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/projects");
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (!id || !isAdmin) return;

    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, isAdmin]);

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
      role: formData.role,
      features: formData.features || [],
      gallery: formData.gallery || [],
      project_date: formData.project_date || null,
    };

    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    router.push("/projects");
    router.refresh();
  };

  const showLoader = authLoading || (isLoading && isAdmin);

  if (showLoader) {
    return (
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
        <SideNav />
        <div className="col-span-1 lg:col-span-9 w-full flex justify-center py-24">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-6 w-32 bg-neutral-800 rounded-md" />
            <div className="h-4 w-48 bg-neutral-800/60 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirecting...
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
        <SideNav />
        <div className="col-span-1 lg:col-span-9 w-full space-y-6 pb-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Projects</span>
          </Link>
          <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
            {error ? `Error: ${error}` : "Project not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-4 lg:px-6">
      <SideNav />

      <motion.div
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="col-span-1 lg:col-span-9 w-full space-y-6 pb-16"
      >
        <div className="flex flex-col gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-200 text-sm font-medium w-fit"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Projects</span>
          </Link>

          <div>
            <h1 className="text-2xl font-semibold tracking-tighter">Edit Project</h1>
            <p className="text-neutral-400 text-sm">Update project details for "{project.title}"</p>
          </div>
        </div>

        <hr className="border-neutral-800" />

        <ProjectForm
          initialData={project}
          onSubmit={handleSave}
          onCancel={() => router.push("/projects")}
          buttonText="Save Changes"
        />
      </motion.div>
    </div>
  );
}

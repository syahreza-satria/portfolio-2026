import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { data: project } = await supabase
      .from("projects")
      .select("title, description")
      .eq("id", id)
      .single();

    if (project) {
      return {
        title: project.title,
        description: project.description,
      };
    }
  } catch (error) {
    console.error("Error generating metadata for project:", id, error);
  }
  return {
    title: "Project Details",
    description: "View project details and technical stack on Syahreza Satria's portfolio.",
  };
}

export default function ProjectDetailLayout({ children }) {
  return <>{children}</>;
}

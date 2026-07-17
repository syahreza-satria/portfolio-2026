import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl = "https://syahreza-satria.xyz";

  // Static routes
  const routes = [
    "",
    "/about",
    "/projects",
    "/achievement",
    "/gears",
    "/contact",
    "/guestbook",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic projects routes
  let projectRoutes = [];
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, created_at")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching projects for sitemap:", error);
    } else if (projects) {
      projectRoutes = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: project.created_at ? new Date(project.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Failed to generate dynamic sitemap routes:", err);
  }

  return [...routes, ...projectRoutes];
}

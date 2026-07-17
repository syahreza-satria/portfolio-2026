export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/projects/create",
        "/projects/*/edit",
      ],
    },
    sitemap: "https://syahreza-satria.xyz/sitemap.xml",
  };
}

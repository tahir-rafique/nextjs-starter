import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();

  /* Static routes — add yours here */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,               lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${baseUrl}/login`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  /* Dynamic routes — fetch from DB in a real app:
   * const posts = await fetchPublishedPosts();
   * const dynamicRoutes = posts.map(p => ({ url: `${baseUrl}/blog/${p.slug}`, ... }));
   */

  return [...staticRoutes];
}

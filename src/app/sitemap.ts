import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://impossiblequiz.app"; // public reference url from README

  const routes = [
    "",
    "/categories",
    "/categories/programming/languages",
    "/categories/business/subcategories",
    "/categories/english/subcategories",
    "/leaderboard",
    "/escape-room",
    "/about",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}

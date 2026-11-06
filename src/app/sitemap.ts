import type { MetadataRoute } from "next";
import { listPublishedArtists } from "@/features/artists/server/queries";
import { listPublishedTattoos } from "@/features/tattoos/server/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tattoos",
    "/studio",
    "/artists",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  let tattooRoutes: MetadataRoute.Sitemap = [];
  let artistRoutes: MetadataRoute.Sitemap = [];

  try {
    const [tattoos, artists] = await Promise.all([
      listPublishedTattoos({ page: 1, pageSize: 48 }),
      listPublishedArtists(),
    ]);

    tattooRoutes = tattoos.items.map((tattoo) => ({
      url: `${base}/tattoos/${tattoo.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    artistRoutes = artists.map((artist) => ({
      url: `${base}/artists/${artist.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Sitemap still returns static routes if catalog is unavailable.
  }

  return [...staticRoutes, ...tattooRoutes, ...artistRoutes];
}

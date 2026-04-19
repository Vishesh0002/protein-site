export type Brand = {
  name: string;
  slug: string;
  /** URL or path to brand logo/image */
  image: string;
  /** Short tagline shown in dropdown */
  tagline: string;
  /** Accent gradient for card */
  gradient: string;
};

export const BRANDS: Brand[] = [
  {
    name: "Front Runner",
    slug: "front-runner",
    image: "/image/2.png",
    tagline: "Premium supplements",
    gradient: "from-orange-500/30 to-amber-500/10",
  },
  {
    name: "MuscleBlaze",
    slug: "muscleblaze",
    image: "/image/1.png",
    tagline: "Mass & strength",
    gradient: "from-red-500/30 to-orange-500/10",
  },
  {
    name: "Optimum Nutrition",
    slug: "optimum-nutrition",
    image: "/image/3.png",
    tagline: "Gold standard whey",
    gradient: "from-yellow-500/30 to-orange-500/10",
  },
  {
    name: "MyProtein",
    slug: "myprotein",
    image: "/image/4.png",
    tagline: "Value & quality",
    gradient: "from-emerald-500/30 to-cyan-500/10",
  },
];

export function findBrandBySlug(slug: string | null): Brand | undefined {
  if (!slug) return undefined;
  return BRANDS.find((b) => b.slug === slug);
}

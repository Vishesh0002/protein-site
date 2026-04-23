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
    name: "Muscle Frame Nutrition",
    slug: "muscle-frame-nutrition",
    image: "/image/Brands/logo1.png",
    tagline: "Premium supplements",
    gradient: "from-orange-500/30 to-amber-500/10",
  },
  {
    name: "Bio Max",
    slug: "bio-max",
    image: "/image/Brands/logo2.png",
    tagline: "Mass & strength",
    gradient: "from-red-500/30 to-orange-500/10",
  },
  {
    name: "Maximum Nutrition",
    slug: "maximum-nutrition",
    image: "/image/Brands/logo3.png",
    tagline: "Gold standard whey",
    gradient: "from-yellow-500/30 to-orange-500/10",
  },
  {
    name: "FitnessTech Nutrition",
    slug: "fitnesstech-nutrition",
    image: "/image/Brands/logo4.png",
    tagline: "Value & quality",
    gradient: "from-emerald-500/30 to-cyan-500/10",
  },
  {
    name: "Athletic Nutrition",
    slug: "athletic-nutrition",
    image: "/image/Brands/logo5.png",
    tagline: "Premium supplements",
    gradient: "from-orange-500/30 to-amber-500/10",
  },
];

export function findBrandBySlug(slug: string | null): Brand | undefined {
  if (!slug) return undefined;
  return BRANDS.find((b) => b.slug === slug);
}

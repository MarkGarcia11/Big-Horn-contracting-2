export type ProjectCategory = "Concrete" | "Block" | "Stucco" | "Remodeling";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  area: string;
  caption: string;
  image: string;
  alt: string;
  placeholder: boolean;
  beforeImage?: string;
  beforeAlt?: string;
};

// Photo references are editorial placeholders, not completed Big Horn projects.
// Replace these with approved project photos and captions before launch.
export const projects: Project[] = [
  {
    id: "patio",
    title: "An easy place to gather",
    category: "Concrete",
    area: "Albuquerque",
    caption: "Concrete patio | Albuquerque",
    image: "https://images.pexels.com/photos/10855255/pexels-photo-10855255.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Outdoor kitchen and paved patio set up for a relaxed afternoon outside",
    placeholder: true,
  },
  {
    id: "courtyard",
    title: "A softer first impression",
    category: "Stucco",
    area: "Central Albuquerque",
    caption: "Southwest stucco | Central Albuquerque",
    image: "https://images.pexels.com/photos/34960819/pexels-photo-34960819.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Warm stucco home with simple lines and a tile roof in late afternoon light",
    placeholder: true,
  },
  {
    id: "block-wall",
    title: "A little more privacy",
    category: "Block",
    area: "Rio Rancho",
    caption: "Masonry detail | Rio Rancho",
    image: "https://images.pexels.com/photos/13137118/pexels-photo-13137118.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Close-up of a patterned masonry wall showing its clean repeating lines",
    placeholder: true,
  },
  {
    id: "kitchen",
    title: "A room for everyday life",
    category: "Remodeling",
    area: "North Valley",
    caption: "Kitchen refresh | North Valley",
    image: "https://images.pexels.com/photos/35493910/pexels-photo-35493910.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Bright kitchen with warm natural light, pale cabinets, and a generous countertop",
    beforeImage: "https://images.pexels.com/photos/36511373/pexels-photo-36511373.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    beforeAlt: "Alternate stock kitchen photograph used as an illustrative before image",
    placeholder: true,
  },
  {
    id: "driveway",
    title: "A cleaner way in",
    category: "Concrete",
    area: "Corrales",
    caption: "Driveway and walk | Corrales",
    image: "https://images.pexels.com/photos/8134845/pexels-photo-8134845.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Modern home with a broad driveway and a clear approach to the entrance",
    placeholder: true,
  },
  {
    id: "adobe",
    title: "Made for the New Mexico light",
    category: "Stucco",
    area: "Albuquerque",
    caption: "Exterior finish | Albuquerque",
    image: "https://images.pexels.com/photos/27395070/pexels-photo-27395070.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Sunlit Southwestern stucco exterior beneath a clear blue sky",
    placeholder: true,
  },
  {
    id: "garden-wall",
    title: "A boundary that belongs",
    category: "Block",
    area: "Placitas",
    caption: "Garden wall | Placitas",
    image: "https://images.pexels.com/photos/1693302/pexels-photo-1693302.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Texture and pattern in a carefully built pale masonry wall",
    placeholder: true,
  },
  {
    id: "interior",
    title: "A fresh start at home",
    category: "Remodeling",
    area: "Los Lunas",
    caption: "Interior update | Los Lunas",
    image: "https://images.pexels.com/photos/36511378/pexels-photo-36511378.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400",
    alt: "Clean, bright remodeled kitchen with simple white cabinetry and warm details",
    placeholder: true,
  },
];

export const projectFilters = ["All", "Concrete", "Block", "Stucco", "Remodeling"] as const;
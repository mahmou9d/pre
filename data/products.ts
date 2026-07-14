import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import { StaticImageData } from "next/image";

export type ProductCategory = "tshirts" | "hoodies" | "oversized" | "limited";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: StaticImageData;
  badge?: string;
  rating: number;
  reviews: number;
  category: ProductCategory;
  color: string;
  sizes: string[];
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    name: "تيشرت كريمي Oversized",
    price: 249,
    oldPrice: 349,
    image: p1,
    badge: "الأكثر مبيعاً",
    rating: 4.9,
    reviews: 128,
    category: "oversized",
    color: "كريمي",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "2",
    name: "تيشرت أسود Heavy Weight",
    price: 269,
    oldPrice: 369,
    image: p2,
    badge: "جديد",
    rating: 4.8,
    reviews: 96,
    category: "tshirts",
    color: "أسود",
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true,
  },
  {
    id: "3",
    name: "تيشرت زيتي Drop Shoulder",
    price: 259,
    oldPrice: 349,
    image: p3,
    rating: 4.7,
    reviews: 74,
    category: "oversized",
    color: "زيتي",
    sizes: ["S", "M", "L"],
    inStock: true,
  },
  {
    id: "4",
    name: "تيشرت برتقالي محروق",
    price: 279,
    oldPrice: 379,
    image: p4,
    badge: "Limited",
    rating: 5.0,
    reviews: 52,
    category: "limited",
    color: "برتقالي",
    sizes: ["M", "L"],
    inStock: true,
  },
  {
    id: "5",
    name: "تيشرت كريمي كلاسيك",
    price: 229,
    image: p1,
    rating: 4.6,
    reviews: 41,
    category: "tshirts",
    color: "كريمي",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "6",
    name: "تيشرت أسود Oversized",
    price: 289,
    oldPrice: 359,
    image: p2,
    badge: "خصم",
    rating: 4.9,
    reviews: 113,
    category: "oversized",
    color: "أسود",
    sizes: ["L", "XL", "XXL"],
    inStock: true,
  },
  {
    id: "7",
    name: "تيشرت زيتي محدود",
    price: 299,
    image: p3,
    badge: "Limited",
    rating: 4.8,
    reviews: 30,
    category: "limited",
    color: "زيتي",
    sizes: ["M", "L"],
    inStock: false,
  },
  {
    id: "8",
    name: "تيشرت برتقالي كاجوال",
    price: 239,
    oldPrice: 309,
    image: p4,
    rating: 4.5,
    reviews: 67,
    category: "tshirts",
    color: "برتقالي",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "9",
    name: "هودي أسود ثقيل",
    price: 549,
    oldPrice: 699,
    image: p2,
    badge: "جديد",
    rating: 4.9,
    reviews: 88,
    category: "hoodies",
    color: "أسود",
    sizes: ["M", "L", "XL"],
    inStock: true,
  },
  {
    id: "10",
    name: "هودي كريمي Oversized",
    price: 569,
    image: p1,
    rating: 4.8,
    reviews: 54,
    category: "hoodies",
    color: "كريمي",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "11",
    name: "هودي زيتي ستايل",
    price: 579,
    oldPrice: 699,
    image: p3,
    rating: 4.7,
    reviews: 39,
    category: "hoodies",
    color: "زيتي",
    sizes: ["L", "XL"],
    inStock: true,
  },
  {
    id: "12",
    name: "تيشرت برتقالي Limited",
    price: 319,
    image: p4,
    badge: "Limited",
    rating: 5.0,
    reviews: 21,
    category: "limited",
    color: "برتقالي",
    sizes: ["M", "L", "XL"],
    inStock: true,
  },
];

export const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "tshirts", label: "تيشرتات" },
  { value: "oversized", label: "Oversized" },
  { value: "hoodies", label: "هوديز" },
  { value: "limited", label: "محدود" },
];

export const colors = ["كريمي", "أسود", "زيتي", "برتقالي"];

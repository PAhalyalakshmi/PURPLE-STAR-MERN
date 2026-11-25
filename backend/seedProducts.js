import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import Product from "./models/Product.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const demoProducts = [
  {
    title: "Luna Wireless Headphones",
    description: "Comfort-fit wireless headphones with rich sound and a clean, modern finish.",
    price: 2499,
    category: "Audio",
    stock: 18,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Solstice Minimal Watch",
    description: "A versatile everyday watch with a minimalist dial and polished metal details.",
    price: 3299,
    category: "Accessories",
    stock: 12,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Comet Everyday Backpack",
    description: "A lightweight, roomy backpack designed for commutes, study days, and weekends.",
    price: 1899,
    category: "Accessories",
    stock: 24,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Orbit Studio Headphones",
    description: "Over-ear listening with a soft padded headband and a bold studio-inspired look.",
    price: 4199,
    category: "Audio",
    stock: 9,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Nova Desk Lamp",
    description: "A warm, focused desk light with a sculptural silhouette for calmer workspaces.",
    price: 1599,
    category: "Home",
    stock: 15,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Prism Mechanical Keyboard",
    description: "A compact mechanical keyboard with tactile keys and a tidy desktop footprint.",
    price: 2799,
    category: "Electronics",
    stock: 11,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Astra Classic Sunglasses",
    description: "Timeless frames with a lightweight feel, made for bright days and easy styling.",
    price: 1299,
    category: "Accessories",
    stock: 20,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Dawn Ceramic Pour-Over Set",
    description: "A simple ceramic pour-over set for slow mornings and freshly brewed coffee.",
    price: 999,
    category: "Home",
    stock: 16,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  },
];

try {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const existingCount = await Product.countDocuments();

  if (existingCount > 0) {
    console.log(`Seed skipped: the products collection already contains ${existingCount} product(s).`);
  } else {
    await Product.insertMany(demoProducts);
    console.log(`Added ${demoProducts.length} demo products.`);
  }
} catch (error) {
  console.error("Product seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

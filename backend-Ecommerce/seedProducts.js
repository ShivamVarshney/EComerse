import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';
import Category from './models/category.model.js';
import { DB_NAME } from './constants.js';

dotenv.config({ path: './backend-Ecommerce/.env' });

const sampleCategories = [
  { name: "Electronics" },
  { name: "Sports" },
  { name: "Accessories" },
  { name: "Clothing" },
  { name: "Home & Garden" }
];

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 20-hour battery life",
    price: 79.99,
    quantity: 50,
    brand: "SoundMax",
    countInStock: 50,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    rating: 4.5,
    numReviews: 10,
  },
  {
    name: "Smart Watch Series 5",
    description: "Advanced smartwatch with health monitoring, GPS, and water resistance",
    price: 299.99,
    quantity: 30,
    brand: "TechWear",
    countInStock: 30,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
    rating: 4.8,
    numReviews: 25,
  },
  {
    name: "Running Shoes Pro",
    description: "Lightweight running shoes with superior cushioning and grip",
    price: 129.99,
    quantity: 100,
    brand: "SportX",
    countInStock: 100,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    rating: 4.6,
    numReviews: 40,
  },
  {
    name: "Laptop Backpack",
    description: "Durable and waterproof backpack with laptop compartment",
    price: 49.99,
    quantity: 75,
    brand: "TravelPro",
    countInStock: 75,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    rating: 4.3,
    numReviews: 15,
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 29.99,
    quantity: 200,
    brand: "TechGear",
    countInStock: 200,
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"],
    rating: 4.4,
    numReviews: 30,
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing products and categories');

    // Create categories
    const categories = await Category.insertMany(sampleCategories);
    console.log('Categories created:', categories.map(c => c.name));

    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Add category IDs to products
    sampleProducts[0].category = categoryMap["Electronics"]; // Headphones
    sampleProducts[1].category = categoryMap["Electronics"]; // Smart Watch
    sampleProducts[2].category = categoryMap["Sports"]; // Running Shoes
    sampleProducts[3].category = categoryMap["Accessories"]; // Laptop Backpack
    sampleProducts[4].category = categoryMap["Electronics"]; // Wireless Mouse

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

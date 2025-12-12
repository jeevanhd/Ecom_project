const mongoose = require("mongoose");
const ProductModel = require("./src/Model/Product.model.js");

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./src/Config/.env",
  });
}

// Sample products data
const sampleProducts = [
  {
    title: "Premium Cotton T-Shirt",
    description:
      "High-quality 100% cotton t-shirt with modern fit. Perfect for casual wear with excellent breathability and comfort.",
    rating: 4,
    discountedPrice: 899,
    originalPrice: 1299,
    quantity: 50,
    category: "male",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341338985-4b5cb2e65c4e?w=500&h=500&fit=crop",
    ],
    userEmail: "admin@ecomart.com",
  },
  {
    title: "Women's Floral Summer Dress",
    description:
      "Elegant floral print dress perfect for summer occasions. Lightweight fabric with comfortable fit and beautiful design.",
    rating: 5,
    discountedPrice: 1599,
    originalPrice: 2199,
    quantity: 30,
    category: "female",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
    ],
    userEmail: "admin@ecomart.com",
  },
  {
    title: "Kids Rainbow Hoodie",
    description:
      "Colorful and cozy hoodie for kids. Made with soft cotton blend material, perfect for playtime and keeping warm.",
    rating: 4,
    discountedPrice: 1199,
    originalPrice: 1599,
    quantity: 40,
    category: "kids",
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop",
    ],
    userEmail: "admin@ecomart.com",
  },
  {
    title: "Men's Formal Blazer",
    description:
      "Professional navy blue blazer perfect for business meetings and formal occasions. Tailored fit with premium fabric.",
    rating: 5,
    discountedPrice: 3499,
    originalPrice: 4999,
    quantity: 25,
    category: "male",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1592878849491-ad0ce71e8117?w=500&h=500&fit=crop",
    ],
    userEmail: "admin@ecomart.com",
  },
  {
    title: "Women's Denim Jacket",
    description:
      "Classic denim jacket with modern styling. Versatile piece that goes with any outfit. Durable and comfortable.",
    rating: 4,
    discountedPrice: 2299,
    originalPrice: 2999,
    quantity: 35,
    category: "female",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    ],
    userEmail: "admin@ecomart.com",
  },
];

// Function to connect to database and add products
async function addSampleProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB successfully!");

    // Check if products already exist
    const existingProducts = await ProductModel.find();

    if (existingProducts.length > 0) {
      console.log(`Database already has ${existingProducts.length} products.`);
      console.log(
        "Do you want to add more sample products? (This will add 5 more products)"
      );
    }

    // Add sample products
    console.log("Adding sample products...");

    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];

      // Check if product with same title already exists
      const existingProduct = await ProductModel.findOne({
        title: product.title,
      });

      if (existingProduct) {
        console.log(
          `⚠️  Product "${product.title}" already exists, skipping...`
        );
        continue;
      }

      const newProduct = await ProductModel.create(product);
      console.log(`✅ Added: ${newProduct.title} (${newProduct.category})`);
    }

    console.log("\n🎉 Sample products added successfully!");
    console.log("\nProducts in database:");

    const allProducts = await ProductModel.find();
    allProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.title} - ₹${product.discountedPrice} (${
          product.category
        })`
      );
    });
  } catch (error) {
    console.error("❌ Error adding products:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
}

// Function to clear all products (optional)
async function clearAllProducts() {
  try {
    await mongoose.connect(process.env.DB_URL);
    await ProductModel.deleteMany({});
    console.log("🗑️  All products cleared from database!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error clearing products:", error.message);
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes("--clear")) {
  clearAllProducts();
} else {
  addSampleProducts();
}

// Usage:
// node addSampleProducts.js          # Add sample products
// node addSampleProducts.js --clear  # Clear all products

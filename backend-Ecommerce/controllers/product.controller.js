import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// ===================== ADD PRODUCT =====================
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, countInStock } = req.body;

    if (!name || !description || !price || !category || !quantity || !brand) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let images = [];

    const files =
      req.files
        ? Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat()
        : [];

    for (const file of files) {
      if (!file?.path) continue;

      try {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.secure_url) {
          images.push(uploaded.secure_url);
        }
      } catch (err) {
        console.log("Cloudinary upload error:", err.message);
      }
    }

    if (images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock: countInStock || quantity,
      images,
    });

    res.status(201).json({ message: "Product created", product });

  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===================== UPDATE PRODUCT =====================
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, countInStock } = req.body;

    if (!name || !description || !price || !category || !quantity || !brand) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(product, {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock: countInStock ?? product.countInStock,
    });

    let images = [];

    const files =
      req.files
        ? Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat()
        : [];

    for (const file of files) {
      if (!file?.path) continue;

      try {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.secure_url) {
          images.push(uploaded.secure_url);
        }
      } catch (err) {
        console.log("Cloudinary upload error:", err.message);
      }
    }

    if (images.length > 0) product.images = images;

    await product.save();

    res.json({ message: "Product updated", product });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===================== DELETE PRODUCT =====================
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", product });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===================== FETCH PRODUCTS =====================
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;

    let keyword = {};
    if (req.query.keyword) {
      keyword.name = { $regex: req.query.keyword, $options: "i" };
    }

    const count = await Product.countDocuments(keyword);

    const products = await Product.find(keyword)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products: products || [],
      page,
      pages: Math.ceil(count / pageSize) || 1,
      hasMore: page < Math.ceil(count / pageSize),
    });

  } catch (error) {
    console.log("FETCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===================== GET BY ID =====================
const fetchProductsById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    console.log("GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===================== FILTER PRODUCTS =====================
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};

    if (checked?.length > 0) args.category = checked;
    if (radio?.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);

    res.json(products);

  } catch (error) {
    console.log("FILTER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===================== OTHER =====================
const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .limit(12)
    .sort({ createdAt: -1 });

  res.json(products);
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(4);

  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(5);
  res.json(products);
});
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const userId = req.user._id;

    const alreadyReviewed = product.reviews.find(
      (r) => r.user?.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: "Already reviewed" });
    }

    const review = {
      name: req.user.username || "User",
      rating: Number(rating),
      comment,
      user: userId,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    const total = product.reviews.reduce((acc, item) => acc + item.rating, 0);

    product.rating = total / product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added" });

  } catch (error) {
    console.log("REVIEW ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===================== EXPORT =====================
export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductsById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
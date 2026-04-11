import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, countInStock } = req.body;

    // Validate fields
    if (!name || !description || !price || !category || !quantity || !brand)
      return res.status(400).json({ message: "All fields are required" });

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded) images.push(uploaded.secure_url);
      }
    }

    if (images.length === 0)
      return res.status(400).json({ message: "At least one image is required" });

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock: countInStock || quantity,  // Set countInStock to provided value or quantity
      images,  // store the uploaded URLs
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, countInStock } = req.body;

    // Validate required fields (except images)
    if (!name || !description || !price || !category || !quantity || !brand)
      return res.status(400).json({ message: "All fields are required" });

    // Find the existing product
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    if (countInStock !== undefined) product.countInStock = countInStock;

    // Handle new uploaded images (if any)
    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        images.push(uploaded.secure_url);
      }
      if (images.length > 0) product.images = images;
    }

    // Save updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    // 1. Get the page number from the query, default to 1
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};



    // 2. Add .skip() to the query to get the correct page
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      const count = await Product.countDocuments({ ...keyword }); 

    const pages = Math.ceil(count / pageSize);

    res.json({
      products,
      // 3. Use the dynamic page number
      page,
      pages,
      // 4. Calculate if there are more pages
      hasMore: page < pages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProductsById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product){
      res.status(404)
      throw new Error("Product is not found")
      
    }
    return res.json(product)
  } catch (error) {
    console.error(error)
     return res.status(404).json({error : "Product not found"})

  }
});

const fetchAllProducts = asyncHandler(async(req,res)=>{
  try {
    const products = await Product.find({}).populate('category').limit(12).sort({createdAt : -1})

    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({error : "Server Error"})
  }
})

const addProductReview = asyncHandler(async(req,res)=>{

/* 
1 .Finds a product in the database using an ID from the URL.

2 .Verifies that the current logged-in user has not already reviewed this product.

3 .If they haven't, it adds their new review.

4 .Updates the product's overall average rating and total number of reviews.

5 .Saves the updated product back to the database.
*/



  try {
    const {rating , comment} = req.body
    const product = await Product.findById(req.params.id)
    if(product){
      const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
      if(alreadyReviewed){
        res.status(400)
        throw new Error("Product already reviewed")
      }

      const review = {
        name : req.user.username,
        rating : Number(rating),
        comment,
        user : req.user._id
      }

      product.reviews.push(review)
      product.numReviews = product.reviews.length
      product.rating = product.reviews.reduce((acc,item) => item.rating + acc ,0) / product.reviews.length


      await product.save()
      res.status(201).json({message : "Review added"})
    } else{
      res.status(404)
      throw new Error("Product Not found")
    }


  } catch (error) {
    console.error(error);
    res.status(400).json(error.message)
  }
})

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ rating: -1 })
      .limit(4);

    res.json(products || []);
  } catch (error) {
    console.error("Top Products Error:", error);
    res.status(500).json({ message: "Server Error in Top Products" });
  }
});

const fetchNewProducts = asyncHandler(async(req,res)=>{
  try {
    const products = await Product.find().sort({_id : -1}).limit(5)
    res.json(products)
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message)
    
  }
})
const filterProducts = asyncHandler(async(req, res)=>{
  try {
    const { checked , radio} = req.body
    let args = {}

    // Handle undefined or empty arrays safely
    if(checked && checked.length  > 0) args.category = checked
    if(radio && radio.length > 0) args.price = {$gte : radio[0] , $lte : radio[1]}

    const products = await Product.find(args)
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(400).json({error : "Server Error"})
  }
})

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
  filterProducts
};

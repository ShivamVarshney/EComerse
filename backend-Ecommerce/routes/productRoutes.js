import { Router } from "express";
import formidable from "express-formidable";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";
import checkId from "../middlewares/checkId.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
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
} from "../controllers/product.controller.js";

const router = Router();
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, upload.array("images", 5), addProduct);
router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router
  .route("/:id")
  .get(fetchProductsById)
  .put(
    authenticate,
    authorizeAdmin,
    upload.array("images", 5),
    updateProductDetails
  )
  .delete(authenticate, authorizeAdmin, removeProduct);

  router.route('/filtered-products').post(filterProducts)

export default router;

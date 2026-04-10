import { Router } from "express";
import { 
   authenticate,
   authorizeAdmin } 
   from "../middlewares/auth.middleware.js";
   import { createCategory , updateCategory , removeCategory, listCategories,readCategory} from "../controllers/category.controller.js";

const router = Router();

router.route("/").post(authenticate,authorizeAdmin ,createCategory);
router.route('/:categoryId').put(authenticate,authorizeAdmin , updateCategory).delete(authenticate,authorizeAdmin,removeCategory)

router.route('/categories').get(listCategories)
router.route('/:id').get(readCategory)



export default router;

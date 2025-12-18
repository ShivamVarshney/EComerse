import Category from '../models/category.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const createCategory = asyncHandler(async(req , res) =>{
  try {
    const { name } = req.body;
    console.log(name)
    if(!name){
      return res.json({error : "Name is required"})
    }

    const existingCategory = await Category.findOne({name})

    if(existingCategory) { 
      return res.json({error : "Already exists"})
    }

    const category = await Category.create({name})
    res.json(category);
    


  } catch (error) {
    console.log(error);
    return res.status(400).json(error)
    
  }
})


const updateCategory = asyncHandler(async(req,res)=>{
  try {
    const {name} = req.body
    const {categoryId} = req.params

    const category =  await Category.findOne({_id : categoryId})
    if(!category){
      return res.status(404).json({error : "category not found"})
    }
    category.name = name
    const updateCategory = await category.save()
    res.json(updateCategory)
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : "Internal server error"})
  }
})


const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category is not present" });
    }

    const removed  = await Category.findByIdAndDelete(categoryId);

    res.status(200).json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listCategories = asyncHandler(async(req,res) =>{
  try {
    const all = await Category.find({})
    res.json(all)
  } catch (error) {
    console.error(error)
    res.status(400).json(error.message)
    
  }
})

const readCategory = asyncHandler(async(req,res)=>{
  try {
    const category = await Category.findOne({_id : req.params.id})
    res.json(category)
  } catch (error) {
    console.error(error)
    return res.status(400).json(error.message)
  }
})
export { 
  createCategory,
  updateCategory,
  removeCategory,
  listCategories,
  readCategory
};
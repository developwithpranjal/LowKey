import express from "express";
import {
  GetCategories,
  AddCategory,
  AddBulkCategories,
  UpdateCategory,
  DeleteCategory,
} from "../controller/category.controller.js";

const CategoryRouter = express.Router();

CategoryRouter.get("/categories", GetCategories);

CategoryRouter.post("/categories", AddCategory);

CategoryRouter.post("/categories/addbulk", AddBulkCategories);

CategoryRouter.put("/categories/:id", UpdateCategory);

CategoryRouter.delete("/categories/:id", DeleteCategory);

export default CategoryRouter;

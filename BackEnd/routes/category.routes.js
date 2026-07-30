import express from "express";
import {
  GetCategories,
  AddCategory,
  AddBulkCategories,
  UpdateCategory,
  DeleteCategory,
} from "../controller/category.controller.js";
import { auth, authorize } from "../middleware/auth.js";

const CategoryRouter = express.Router();

CategoryRouter.get("/categories", GetCategories);

CategoryRouter.post("/categories", auth, authorize("admin"), AddCategory);

CategoryRouter.post("/categories/addbulk", auth, authorize("admin"), AddBulkCategories);

CategoryRouter.put("/categories/:id", auth, authorize("admin"), UpdateCategory);

CategoryRouter.delete("/categories/:id", auth, authorize("admin"), DeleteCategory);

export default CategoryRouter;

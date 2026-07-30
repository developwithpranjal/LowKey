import express from "express";
import {
  GetProducts,
  AddProduct,
  AddBulkProducts,
  UpdateProduct,
  DeleteProduct,
} from "../controller/product.controller.js";
import { auth, authorize } from "../middleware/auth.js";


const ProductRouter = express.Router();

ProductRouter.get("/products", GetProducts);

ProductRouter.post("/products", auth, authorize("admin"), AddProduct);

ProductRouter.post("/products/addbulk", auth, authorize("admin"), AddBulkProducts);

ProductRouter.put("/products/:id", auth, authorize("admin"), UpdateProduct);

ProductRouter.delete("/products/:id", auth, authorize("admin"), DeleteProduct);

export default ProductRouter;

import express from "express";
import {
  GetProducts,
  AddProduct,
  AddBulkProducts,
  UpdateProduct,
  DeleteProduct,
} from "../controller/product.controller.js";


const ProductRouter = express.Router();

ProductRouter.get("/products", GetProducts);

ProductRouter.post("/products", AddProduct);

ProductRouter.post("/products/addbulk", AddBulkProducts);

ProductRouter.put("/products/:id", UpdateProduct);

ProductRouter.delete("/products/:id", DeleteProduct);

export default ProductRouter;

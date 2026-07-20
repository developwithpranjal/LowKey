import express from "express";
import { AddProductVariant,GetProductVariants,UpdateProductVariant,DeleteProductVariant, AddBulkProductVarient } from "../controller/product_variant.controller.js";

const VariantRouter = express.Router();

VariantRouter.get("/variant", GetProductVariants);

VariantRouter.post("/variant", AddProductVariant);

VariantRouter.post("/products/addbulk", AddBulkProductVarient);

VariantRouter.put("/variant/:id", UpdateProductVariant);

VariantRouter.delete("/variant/:id",DeleteProductVariant);

export default VariantRouter;

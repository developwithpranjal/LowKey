import express from "express";
import { AddProductVariant,GetProductVariants,UpdateProductVariant,DeleteProductVariant, AddBulkProductVarient } from "../controller/product_variant.controller.js";
import { auth, authorize } from "../middleware/auth.js";

const VariantRouter = express.Router();

VariantRouter.get("/variant", GetProductVariants);

VariantRouter.post("/variant", auth, authorize("admin"), AddProductVariant);

VariantRouter.post("/variant/addbulk", auth, authorize("admin"), AddBulkProductVarient);

VariantRouter.put("/variant/:id", auth, authorize("admin"), UpdateProductVariant);

VariantRouter.delete("/variant/:id", auth, authorize("admin"), DeleteProductVariant);

export default VariantRouter;

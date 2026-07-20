import mongoose from "mongoose";
const ProductVariantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: [true, "Product Is Required"],
    },
    variants: {
      type: [
        {
          attribute: { type: String, required: true },
          value: { type: String, required: true }, 
        },
      ],
      default: [],
    },
    stock_quantity: {
      type: Number,
      required: [true, "Stock Quantity Is Required"],
      default: 0,
      min: [0, "Stock Quantity Cannot Be Negative"],
    },
    sku: {
      type: String,
      required: [true, "SKU Is Required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

const ProductVariantModel = mongoose.model("productVariants", ProductVariantSchema);
export default ProductVariantModel
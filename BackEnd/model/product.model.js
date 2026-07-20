import mongoose from "mongoose";
import { GenerateSlug } from "../slug.js";

const ProductSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

ProductSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = GenerateSlug(this.name);
  }
    if (this.discount_price != null && this.discount_price > this.price) {
    return next(new Error("Discounted Price cannot exceed Original Price"));
  }

  next();
});

ProductSchema.pre("insertMany", function (next, docs) {
  docs.forEach((doc) => {
    if (doc.name) {
      doc.slug = GenerateSlug(doc.name);
    }
  });
  next();
});

ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.discount_price != null && update.price != null) {
    if (update.discount_price > update.price) {
      return next(new Error("Discounted Price cannot exceed Original Price"));
    }
  }
  next();
});

const productModel = mongoose.model("products", ProductSchema);

export default productModel;

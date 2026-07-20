import mongoose from "mongoose";
import { GenerateSlug } from "../slug.js";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    parent_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
  },
  { timestamps: true },
);

CategorySchema.pre("save", function (next) {
  if (this.name) {
    this.slug = GenerateSlug(this.name);
  }
  next();
});

CategorySchema.pre("insertMany", function (next, docs) {
  docs.forEach((doc) => {
    if (doc.name) {
      doc.slug = GenerateSlug(doc.name);
    }
  });
  next();
});

const CategoryModel = mongoose.model("categories", CategorySchema);

export default CategoryModel;
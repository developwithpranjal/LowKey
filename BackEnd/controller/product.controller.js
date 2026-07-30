import mongoose from "mongoose";
import productModel from "../model/product.model.js";
import CategoryModel from "../model/category.model.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ATTRIBUTE_VALIDATORS = {
  color: {
    isValid: (v) => !/^\d+$/.test(v.trim()),
    message: "color must be a text value, not a number",
  },
};

const RESERVED_QUERY_PARAMS = new Set([
  "category_id",
  "category_name",
  "page",
  "limit",
  "minPrice",
  "maxPrice",
  "sort",
  "is_active",
]);

export async function GetProducts(req, res) {
  try {
    const {
      category_id,
      category_name,
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      sort,
      is_active,
      ...rest
    } = req.query;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);

    const matchStage = {};
    matchStage.is_active =
      is_active !== undefined ? is_active === "true" : true;

    if (category_id) {
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return res.status(400).json({ message: "Invalid category_id" });
      }
      matchStage.category_id = new mongoose.Types.ObjectId(category_id);
    }

    if (category_name) {
      const category = await CategoryModel.findOne({
        name: { $regex: `^${escapeRegex(category_name)}$`, $options: "i" },
      });
      if (!category) {
        return res.json({
          currentPage: pageNum,
          totalPages: 0,
          totalproduct: 0,
          data: [],
          message: "No category found with this name",
        });
      }
      matchStage.category_id = category._id;
    }

    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice !== undefined) matchStage.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) matchStage.price.$lte = Number(maxPrice);
    }

    const pipeline = [{ $match: matchStage }];

    const attributeKeys = Object.keys(rest).filter(
      (key) =>
        !RESERVED_QUERY_PARAMS.has(key) &&
        rest[key] !== undefined &&
        rest[key] !== "",
    );

    // ---- validate before hitting the DB ----
    for (const key of attributeKeys) {
      const validator = ATTRIBUTE_VALIDATORS[key.toLowerCase()];
      if (!validator) continue;
      const values = String(rest[key])
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const invalidValue = values.find((v) => !validator.isValid(v));
      if (invalidValue !== undefined) {
        return res.status(400).json({
          message: `Invalid value "${invalidValue}" for "${key}": ${validator.message}`,
        });
      }
    }

    if (attributeKeys.length > 0) {
      pipeline.push({
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product_id",
          as: "variants_data",
        },
      });

      const andConditions = attributeKeys.map((key) => {
        const values = String(rest[key])
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        return {
          "variants_data.variants": {
            $elemMatch: {
              attribute: { $regex: `^${escapeRegex(key)}$`, $options: "i" },
              value: {
                $in: values.map((v) => new RegExp(`^${escapeRegex(v)}$`, "i")),
              },
            },
          },
        };
      });

      pipeline.push({ $match: { $and: andConditions } });
      pipeline.push({ $project: { variants_data: 0 } });
    }

    if (sort === "price_asc") pipeline.push({ $sort: { price: 1 } });
    else if (sort === "price_desc") pipeline.push({ $sort: { price: -1 } });
    else if (sort === "newest") pipeline.push({ $sort: { createdAt: -1 } });

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await productModel.aggregate(countPipeline);
    const totalproduct = countResult[0]?.total || 0;

    const skip = (pageNum - 1) * limitNum;
    pipeline.push({ $skip: skip }, { $limit: limitNum });

    const Products = await productModel.aggregate(pipeline);

    res.json({
      currentPage: pageNum,
      totalPages: Math.ceil(totalproduct / limitNum),
      totalproduct,
      data: Products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function AddProduct(req, res) {
  try {
    const newproduct = new productModel({
      ...req.body,
      created_by: req.user._id,
    });
    await newproduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", data: newproduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function AddBulkProducts(req, res) {
  try {
    const productsData = req.body.map((prod) => ({
      ...prod,
      created_by: req.user._id,
    }));
    const Products = await productModel.insertMany(productsData);
    res
      .status(201)
      .json({ message: "Bulk Products added successfully", data: Products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function UpdateProduct(req, res) {
  try {
    const productId = req.params.id;
    const UpdatedProduct = req.body;
    const Products = await productModel.findByIdAndUpdate(
      productId,
      UpdatedProduct,
      { new: true, runValidators: true },
    );
    if (!Products) return res.json({ message: "Product Not Found" });
    await Products.save();
    res.json({ message: "Products are Updated", data: Products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function DeleteProduct(req, res) {
  try {
    const DeletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!DeletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully", data: DeletedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

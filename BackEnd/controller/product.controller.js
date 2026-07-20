import productModel from "../model/product.model.js";
import CategoryModel  from "../model/category.model.js";

export async function GetProducts(req, res) {
  try {
    const { category_id, category_name, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (category_id) {
      filter.category_id = category_id;
    }

    if (category_name) {
      const category = await CategoryModel.findOne({
        name: { $regex: category_name, $options: "i" },
      });

      if (!category) {
        return res.json({
          total: 0,
          data: [],
          message: "No category found with this name",
        });
      }

      filter.category_id = category._id;
    }

    const skip = (page - 1) * limit;
    const totalproduct = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalproduct / limit);

    const Products = await productModel.find(filter).skip(skip).limit(limit);

    res.json({
      currentPage: Number(page),
      totalPages,
      totalproduct,
      data: Products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function AddProduct(req, res) {
  try {
    const newproduct = new productModel(req.body);

    await newproduct.save();

    res.status(201).json({
      message: "Product added successfully",
      data: newproduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function AddBulkProducts(req, res) {
  try {
    const Products = await productModel.insertMany(req.body);

    res.status(201).json({
      message: "Bulk Products added successfully",
      data: Products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}




export async function UpdateProduct(req, res) {
  try {
    const productId = req.params.id;
    const UpdatedProduct = req.body;

    const Products = await productModel.findByIdAndUpdate(
      productId,
      UpdatedProduct,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!Products) {
      return res.json({
        message: "Product Not Found",
      });
    }

    await Products.save();

    res.json({
      message: "Products are Updated",
      data: Products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function DeleteProduct(req, res) {
  try {
    const DeletedProduct = await productModel.findByIdAndDelete(req.params.id);

    if (!DeletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
      data: DeletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

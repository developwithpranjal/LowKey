import ProductVariantModel from "../model/product_variant.model.js";

export async function AddProductVariant(req, res) {
  try {
    const newVariant = new ProductVariantModel(req.body);
    await newVariant.save();

    res.status(201).json({
      message: "Product variant added successfully",
      data: newVariant,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function GetProductVariants(req, res) {
  try {
    const { product_id } = req.query;
    const filter = {};
    if (product_id) filter.product_id = product_id;

    const variants = await ProductVariantModel.find(filter);

    res.json({
      total: variants.length,
      data: variants,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
export async function AddBulkProductVarient(req, res) {
  try {
    const product_varient = await ProductVariantModel.insertMany(req.body);

    res.status(201).json({
      message: "Bulk Products added successfully",
      data: product_varient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function UpdateProductVariant(req, res) {
  try {
    const updatedVariant = await ProductVariantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVariant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    res.json({
      message: "Product variant updated successfully",
      data: updatedVariant,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function DeleteProductVariant(req, res) {
  try {
    const deletedVariant = await ProductVariantModel.findByIdAndDelete(req.params.id);

    if (!deletedVariant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    res.json({
      message: "Product variant deleted successfully",
      data: deletedVariant,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
import CategoryModel from "../model/category.model.js";

export async function GetCategories(req, res) {
  try {
    const categories = await CategoryModel.find();

    res.json({
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function AddCategory(req, res) {
  try {
    const newCategory = new CategoryModel(req.body);
    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function AddBulkCategories(req, res) {
  try {
    const categories = await CategoryModel.insertMany(req.body);

    res.status(201).json({
      message: "Bulk Categories added successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function UpdateCategory(req, res) {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function DeleteCategory(req, res) {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

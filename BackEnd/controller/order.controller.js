import orderModel from "../model/order.model.js";

export async function GetOrders(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const totalorder = await orderModel.countDocuments();
    const totalPages = Math.ceil(totalorder / limit);

    if (page > totalPages && totalorder > 0) {
      return res.status(404).json({
        message: `Page ${page} does not exist`,
        totalPages,
      });
    }
    const skip = (page - 1) * limit;

    const Orders = await orderModel
      .find()
      .populate("user_id", "name email")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      currentPage: page,
      totalPages,
      totalorder,
      Orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function GetOrderById(req, res) {
  try {
    const Order = await orderModel
      .findById(req.params.id)
      .populate("user_id", "name email");

    if (!Order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      data: Order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function GetOrdersByUser(req, res) {
  try {
    const userId = req.params.userId;

    const Orders = await orderModel
      .find({ user_id: userId })
      .sort({ created_at: -1 });

    res.json({
      data: Orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function AddOrder(req, res) {
  try {
    const neworder = new orderModel(req.body);

    await neworder.save();

    res.status(201).json({
      message: "Order placed successfully",
      data: neworder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function AddBulkOrders(req, res) {
  try {
    const Orders = await orderModel.insertMany(req.body);

    res.status(201).json({
      message: "Bulk Orders added successfully",
      data: Orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function UpdateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const UpdatedOrder = req.body;

    const Order = await orderModel.findByIdAndUpdate(orderId, UpdatedOrder, {
      new: true,
      runValidators: true,
    });

    if (!Order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    res.json({
      message: "Order is Updated",
      data: Order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function UpdateOrderStatus(req, res) {
  try {
    const orderId = req.params.id;
    const { order_status } = req.body;

    const Order = await orderModel.findByIdAndUpdate(
      orderId,
      { order_status },
      { new: true, runValidators: true },
    );

    if (!Order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    res.json({
      message: "Order status updated",
      data: Order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function DeleteOrder(req, res) {
  try {
    const DeletedOrder = await orderModel.findByIdAndDelete(req.params.id);

    if (!DeletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
      data: DeletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
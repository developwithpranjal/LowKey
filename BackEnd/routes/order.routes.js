import express from "express";
import {
  GetOrders,
  GetOrderById,
  GetOrdersByUser,
  AddOrder,
  AddBulkOrders,
  UpdateOrder,
  UpdateOrderStatus,
  DeleteOrder,
} from "../controller/order.controller.js";

const orderRouter = express.Router();

orderRouter.get("/", GetOrders);
orderRouter.get("/user/:userId", GetOrdersByUser);
orderRouter.get("/:id", GetOrderById);

orderRouter.post("/", AddOrder);
orderRouter.post("/bulk", AddBulkOrders);

orderRouter.put("/:id", UpdateOrder);
orderRouter.patch("/:id/status", UpdateOrderStatus);

orderRouter.delete("/:id", DeleteOrder);

export default orderRouter;
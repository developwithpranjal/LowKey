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
import { auth, authorize } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.get("/", auth, authorize("admin"), GetOrders);
orderRouter.get("/user/:userId", auth, GetOrdersByUser);
orderRouter.get("/:id", auth, GetOrderById);

orderRouter.post("/", auth, AddOrder);
orderRouter.post("/bulk", auth, AddBulkOrders);

orderRouter.put("/:id", auth, authorize("admin"), UpdateOrder);
orderRouter.patch("/:id/status", auth, authorize("admin"), UpdateOrderStatus);

orderRouter.delete("/:id", auth, authorize("admin"), DeleteOrder);

export default orderRouter;
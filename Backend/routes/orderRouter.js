// routes/orderRouter.js
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/add", createOrder);
router.get("/all", getOrders);
router.get("/:id", getOrderById);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);

export default router;


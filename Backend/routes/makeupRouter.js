// routes/makeupRouter.js
import express from "express";
import {
  createMakeup,
  getMakeups,
  getMakeupById,
  updateMakeup,
  deleteMakeup,
} from "../controllers/cosmetics/makeupController.js";

const router = express.Router();

router.post("/add", createMakeup);
router.get("/all", getMakeups);
router.get("/:id", getMakeupById);
router.put("/:id", updateMakeup);
router.delete("/:id", deleteMakeup);

export default router;

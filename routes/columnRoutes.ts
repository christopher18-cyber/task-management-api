import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getColumnsById, createColumn, updateColumn, deleteColumn } from "../controllers/columnController.js";


const router = Router()

router.delete("/delete/:id",protect,deleteColumn)
router.post("/create",protect,createColumn)
router.get("/board/:boardId",protect,getColumnsById)
router.put("/update/:id",protect,updateColumn)

export default router
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBoard, getBoards } from "../controllers/boardController.js";


const router = Router()

router.post("/create",protect ,createBoard)
router.get("/all",protect ,getBoards)

export default router
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBoard, getBoards, addMemberToBoard, getBoardById, deleteBoard } from "../controllers/boardController.js";


const router = Router()

router.post("/create",protect ,createBoard)
router.get("/all",protect ,getBoards)
router.post('/:id/members', protect, addMemberToBoard);
router.get("/:id", protect ,getBoardById)
router.delete("/:id", protect, deleteBoard);

export default router
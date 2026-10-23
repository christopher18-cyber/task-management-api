import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCard, getCardsByBoard, deleteCard,updateCard } from "../controllers/cardController.js";


const router = Router()

router.post("/",protect,createCard)
router.get("/board/:boardId",protect,getCardsByBoard)
router.delete("/:id",protect,deleteCard)
router.put("/:id",protect,updateCard)


export default router
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getBoardActivities } from "../controllers/activityController.js";

const router = Router()

router.get('/board/:boardId',protect, getBoardActivities);


export default router
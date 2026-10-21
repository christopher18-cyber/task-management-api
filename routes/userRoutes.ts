import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser,
    loginUser,
    changePassword,
    forgotPassword,
    verifyEmail,
    getUserDashboard } from "../controllers/userController.js";

const router = Router()

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Protected routes (require Bearer token)
router.get('/me', protect, getUserDashboard);
router.put('/change-password', protect, changePassword);

export default router
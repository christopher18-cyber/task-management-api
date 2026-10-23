import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';
import logger from './logger.js';

interface LogActivityParams {
    boardId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
    action: string;
    details?: string;
}

export async function logActivity({ boardId, userId, action, details }: LogActivityParams): Promise<void> {
    try {
        await ActivityLog.create({
            boardId: new mongoose.Types.ObjectId(boardId),
            user: new mongoose.Types.ObjectId(userId),
            action,
            details
        });
    } catch (error: any) {
        logger.error(`Activity logging error: ${error.message}`);
    }
}
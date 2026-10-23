import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../utils/logger.js";
import Board from "../models/Board.js";
import ActivityLog from "../models/ActivityLog.js";

export async function getBoardActivities(req:AuthRequest, res:Response): Promise<Response>{
    logger.info(`Get board activites endpoint hitted`)
    try{
        const {boardId} = req.params;
        const userId = req.user?.id;

        const board = await Board.findById(boardId)
        if(!board){
            return res.status(404).json({
                success:false,
                message:"Board not found"
            })
        }

        const isOwner = board.owner && board.owner.toString() === userId;
        const ismember =  board.member.some((m:any)=> m.toString() === userId)

        if(!isOwner && !ismember){
            return res.status(403).json({
                success:false,
                message:"Not authorized to view board activities"
            })
        }


        const activities = await ActivityLog.find({boardId})
        .populate("userId","name email")
        .sort({createdAt: -1})
        .limit(50)

        return res.status(200).json({
            success:true,
            count: activities.length,
            data: activities
        })
    }catch(error:any){
        logger.error(`Get activities error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}
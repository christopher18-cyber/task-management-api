import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { logActivity } from "../utils/activityHelper.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Board from "../models/Board.js";
import Column from "../models/Column.js";
import Card from "../models/Card.js";


export async function createCard(req:AuthRequest, res:Response):Promise<Response>{
    logger.info("Create endpoint hitted")
    try{
        const { title, description, columnId, boardId, priority, dueDate, assignedTo } = req.body;
        if (!title || !columnId || !boardId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, columnId, and boardId'
            });
        }

        const board = await Board.findById(boardId)
        if(!board){
            return res.status(404).json({
                success:false,
                message:"Board not found."
            })
        }

        const column = await Column.findOne({_id:columnId,board:boardId})
        if(!column){
            return res.status(404).json({
                success:false,
                message:"Column not found on this board"
            })
        }
        const cardCount = await Card.countDocuments({columnId})

        const card = await Card.create({
            title,
            description,
            columnId: new mongoose.Types.ObjectId(columnId),
            boardId: new mongoose.Types.ObjectId(boardId),
            priority: priority || "Medium",
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
            order: cardCount
        })

        await logActivity({
            boardId,
            userId: req.user!.id,
            action: 'CREATED_CARD',
            details: `Created task "${title}"`
        });

        return res.status(201).json({
            success:true,
            message:"Card created successfully",
            data:card
        })
    }catch(error:any){
        logger.error(`Create card error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}



export async function getCardsByBoard(req:AuthRequest, res:Response):Promise<Response>{
    logger.info("Get cards by board endpoint hitted")
    try{
        const {boardId} = req.params;
        const cards = await Card.find({boardId}).sort({order:1});

        return res.status(200).json({
            success:true,
            count: cards.length,
            data: cards
        })
    }catch(error:any){
        logger.error(`Get cards error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}


export async function updateCard(req:AuthRequest, res:Response):Promise<Response>{
    logger.info(`Update card endpoint hitted`)
    try{
        const {id} = req.params;
        const {title,description,columnId, priority, dueDate, assignedTo, order } = req.body;

        const card = await Card.findById(id)
        if(!card){
            return res.status(404).json({
                success:false,
                message:"Card not found."
            })
        }


        if(columnId && columnId !== card.columnId.toString()){
            const targetColumn = await Column.findOne({_id:columnId,board:card.boardId})
            if(!targetColumn){
                return res.status(404).json({
                    success:false,
                    message:"Target not found on this board."
                })
            }

            card.columnId = new mongoose.Types.ObjectId(columnId)
        }

        if (title !== undefined) card.title = title;
        if (description !== undefined) card.description = description;
        if (priority !== undefined) card.priority = priority;
        if (dueDate !== undefined) card.dueDate = dueDate ? new Date(dueDate) : undefined;
        if (assignedTo !== undefined) card.assignedTo = assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined;
        if (order !== undefined) card.order = order;

        await card.save();

        return res.status(200).json({
            success: true,
            message: 'Card updated successfully',
            data: card
        });
    }catch(error:any){
        logger.error(``)
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}


export async function deleteCard(req:AuthRequest, res:Response):Promise<Response>{
    logger.info("Delete card endpoint hitted")
    try{
        const {id} = req.params;
        const card = await Card.findByIdAndDelete(id)

        if(!card){
            return res.status(404).json({
                success:false,
                message:"Card not found."
            })
        }

        return res.status(200).json({
            success:true,
            message:"Card deleted successfully."
        })
    }catch(error:any){
        logger.error(`Delete card error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}


export async function reorderCards(req:AuthRequest, res:Response):Promise<Response>{
    logger.info("Re order endpoint hitted")
    try{
        const {boardId, updates} = req.body;
        const userId = req.user?.id;

        if(!boardId || !updates || !Array.isArray(updates)){
            return res.status(400).json({
                success:false,
                message: "Please provide boardId and an array of card updates."
            })
        }

        const board = await Board.findById(boardId)
        if(!board){
            return res.status(404).json({
                success: false,
                message: "Board not found"
            })
        }

        const isOwner = board.owner && board.owner.toString() === userId;
        const isMember = board.members.some((m:any)=> m.toString() === userId)
        if(!isOwner && !isMember){
            return res.status(403).json({
                success:false,
                message:"Not authorized to modify this board"
            })
        }


        const updateOperations = updates.map(async (item:{id:string; columnId:string; order:number})=>{
            return Card.findByIdAndUpdate(
                item.id,
                {
                    columId: new mongoose.Types.ObjectId(item.columnId),
                    order: item.order
                },
                {
                    new: true
                }
            )
        })

        await Promise.all(updateOperations)

        await logActivity({
            boardId,
            userId: userId!,
            action: 'REORDER_CARDS',
            details: 'Updated card positions and columns on the board'
        });

        return res.status(200).json({
            success: true,
            message: 'Cards reordered successfully'
        });
    }catch(error:any){
        logger.error(`Reorder cards error :${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}
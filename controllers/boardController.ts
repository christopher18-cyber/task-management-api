import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import Board from "../models/Board.js";
import logger from "../utils/logger.js";
import Column from "../models/Column.js";


export async function createBoard(req: AuthRequest, res:Response):Promise<Response>{
    try{
        const {title,description} = req.body;
        const userId = req.user?.id

        if(!title){
            return res.status(400).json({
                success:false,
                message:"Please provide a board title"
            })
        }

        const board = await Board.create({
            title,
            description,
            owner: userId
        })


        const defaultColumns = ["To Do","In Progress","Done"];
        const columnPromises = defaultColumns.map((colTitle,index)=>{
            Column.create({
                title: colTitle,
                boardId: board._id,
                order: index
            })
        })

        await Promise.all(columnPromises)
        return res.status(201).json({
            success: true,
            message: "Board created successfully with default columns.",
            data:board
        })
    }catch(error:any){
        logger.error(`Create board error: ${error.message}`)
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}


export async function getBoards(req:AuthRequest, res:Response):Promise<Response>{
    try{
        const userId = req.user?.id
        const boards = await Board.find({owner:userId}).sort({createdAt:-1})

        return res.status(200).json({
            success:true,
            count: boards.length,
            data: boards
        })
    }catch(error:any){
        logger.error(`Get boards error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}
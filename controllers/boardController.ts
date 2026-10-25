import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import Board from "../models/Board.js";
import logger from "../utils/logger.js";
import Column from "../models/Column.js";
import User from "../models/User.js";


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
    logger.info(`Get boards endpoint hitted`)
    try{
        const userId = req.user?.id
        const boards = await Board.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).sort({ createdAt: -1 });

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


export async function addMemberToBoard(req:AuthRequest, res:Response):Promise<Response>{
    logger.info(``)
    try{
        const {id} = req.params;
        const {email} = req.body;
        const userId = req.user?.id


        if(!email){
            return res.status(400).json({
                success:false,
                message:"Please provide a user email"
            })
        }
        
        const board = await Board.findById(id)
        if(!board){
            return res.status(404).json({
                success:false,
                message:"Board not found."
            })
        }

        if(board.owner && board.owner.toString() == userId){
            return res.status(403).json({
                success:false,
                message:"Only the board owner can add member"
            })
        }

        const userToAdd = await User.findOne({email})

        if(!userToAdd){
            return res.status(404).json({
                success:false,
                message:"User with this email not found"
            })
        }

        if (board.owner && board.owner.toString() === userToAdd._id.toString()) {
            return res.status(400).json({ success: false, message: 'User is already the owner of this board' });
        }

        if(board.members.includes(userToAdd._id)){
            return res.status(400).json({
                success:false,
                message:"User is already a member of this board"
            })
        }

        board.members.push(userToAdd._id)
        await board.save()

        return res.status(200).json({
            success:true,
            message: `Successfully added ${userToAdd.name} as a board member`,
            data: board
        })
    }catch(error:any){
        logger.error(`Add board member error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}


export async function getBoardById(req:AuthRequest, res:Response):Promise<Response>{
    logger.info("Get boards by id endpoint hiited")
    try {
        const {id} = req.params;
        const userId = req.user?.id;

        const board = await Board.findById(id).populate('owner', 'name email').populate('members', 'name email');
        if (!board) {
            return res.status(404).json({ 
                success: false,
                message: 'Board not found' 
            });
        }

        const isOwner = board.owner && board.owner._id.toString() === userId;
        const isMember = board.members.some((member: any) => member._id.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this board' });
        }

        return res.status(200).json({
            success: true,
            data: board,
        });
    } catch (error:any) {
        logger.error(`Get a single board error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}
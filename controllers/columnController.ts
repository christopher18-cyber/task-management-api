import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import logger from "../utils/logger.js";
import Board from "../models/Board.js";
import Column from "../models/Column.js";
import Card from "../models/Card.js";
import mongoose from "mongoose";

export async function getColumnsById(req: AuthRequest, res: Response): Promise<Response> {
    logger.info("Get columns by id endpoint hitted");
    try {
        const { boardId } = req.params;
        const userId = req.user?.id;

        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: "Board not found"
            });
        }

        const isOwner = board.owner && board.owner.toString() === userId;
        const isMember = Array.isArray(board.members) && board.members.some((m: any) => m?.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this board' });
        }

        const columns = await Column.find({ boardId }).sort({ order: 1 });

        return res.status(200).json({
            success: true,
            count: columns.length,
            data: columns
        });
    } catch (error: any) {
        logger.error(`Get column error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function createColumn(req: AuthRequest, res: Response): Promise<Response> {
    logger.info("Create column endpoint hitted.");
    try {
        const { title, boardId } = req.body;
        const userId = req.user?.id;

        if (!title || !boardId) {
            return res.status(400).json({ success: false, message: 'Please provide a title and boardId' });
        }

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ success: false, message: 'Board not found' });
        }

        const isOwner = board.owner && board.owner.toString() === userId;
        const isMember = Array.isArray(board.members) && board.members.some((m: any) => m?.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this board' });
        }

        const columnCount = await Column.countDocuments({ boardId });

        const column = await Column.create({
            title,
            boardId: new mongoose.Types.ObjectId(boardId),
            order: columnCount
        });

        return res.status(201).json({
            success: true,
            message: 'Column created successfully',
            data: column
        });
    } catch (error: any) {
        logger.error(`create column error: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function updateColumn(req: AuthRequest, res: Response): Promise<Response> {
    logger.info("Update column endpoint hitted");
    try {
        const { id } = req.params;
        const { title, order } = req.body;
        const userId = req.user?.id;

        const column = await Column.findById(id);
        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Column not found'
            });
        }

        const board = await Board.findById(column.boardId);
        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Associated board not found'
            });
        }

        const isOwner = board.owner && board.owner.toString() === userId;
        const isMember = Array.isArray(board.members) && board.members.some((m: any) => m?.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this column'
            });
        }

        if (title !== undefined) column.title = title;
        if (order !== undefined) column.order = order;

        await column.save();

        return res.status(200).json({
            success: true,
            message: 'Column updated successfully',
            data: column
        });
    } catch (error: any) {
        logger.error(`Update column error: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function deleteColumn(req: AuthRequest, res: Response): Promise<Response> {
    logger.info("Delete column endpoint hitted.");
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const column = await Column.findById(id);
        if (!column) {
            return res.status(404).json({ success: false, message: 'Column not found' });
        }

        const board = await Board.findById(column.boardId);
        if (!board) {
            return res.status(404).json({ success: false, message: 'Associated board not found' });
        }

        const isOwner = board.owner && board.owner.toString() === userId;
        if (!isOwner) {
            return res.status(403).json({ success: false, message: 'Only the board owner can delete columns' });
        }

        // Delete associated cards to prevent orphaned documents
        await Card.deleteMany({ columnId: id });
        await column.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Column and associated cards deleted successfully'
        });
    } catch (error: any) {
        logger.error(`Delete column error: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
    }
}
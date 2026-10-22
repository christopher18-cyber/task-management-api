import "dotenv/config"
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request{
    user?:{
        id: string
    }
}



export async function protect(req:AuthRequest,res:Response, next:NextFunction):Promise<void>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(" ")[1]

            const decoded: any = jwt.verify(token,process.env.JWT_SECRET || "")

            req.user = { id:decoded.id }

            return next();
        }catch(error:any){
            res.status(401).json({
                success:false,
                message:"Not authorized, "
            })

            return;
        }
    }

    if(!token){
        res.status(401).json({
            success:false,
            message:"Not authorized, no token provided."
        })
    }
}
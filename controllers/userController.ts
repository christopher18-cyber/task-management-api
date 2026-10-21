import { Request,Response } from "express";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { emailService } from "../utils/emailService.js";

export async function registerUser(req: Request, res: Response): Promise<Response>{
    logger.info("Regsiter user endpoint hitted.")
    try{
        const {name, email, password, avatar} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide name, email and password."
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ success: false, message: 'User with this email already exists'})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 5 * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            avatar: avatar || "",
            isVerified:false,
            emailVerificationToken: verificationCode,
            emailVerificationExpires: verificationExpires
        });

        try{
            await emailService.sendVerification(user.email,verificationCode)
        }catch(emailError:any){
            logger.error(`Failed to send verification email: ${emailError.message}`)
        }

        return res.status(201).json({
            success:true,
            message:"User registered successfully. Please check your email for the verification code.",
            data:{
                _id:user._id,
                name:user.name,
                email:user.email,
                isVerified: user.isVerified
            }
        })
        
    }catch (error: any) {
        logger.error(`Registration error: ${error.message}`);
    return res.status(500).json({ success: false, error: error.message });
  }
}


export async function verifyEmail(req:Request,res:Response):Promise<Response>{
    logger.info("Verify email endpoint hitted")
    try{
        const {email, code} = req.body;
        if(!email || !code){
            return res.status(400).json({
                success:false,
                message:"Please provide email and verification code."
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found."
            })
        }
        if(user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Email is already verified"
            })
        }

        if(user.emailVerificationToken !== code || !user.emailVerificationExpires || user.emailVerificationExpires< new Date()){
            return res.status(400).json({
                success:false,
                message:'Invalid or expired verification code.'
            })
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save()

        return res.status(200).json({
            success:false,
            message:"Email verified successfully"
        })
    }catch(error:any){
        logger.error(`Email verification error ${error.message}`)
        return res.status(500).json({
            success:false,
            error: error.message
        })
    }
}


export async function loginUser(req:Request, res:Response): Promise<Response>{
    logger.info("Login user endpoint hiited.")
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Please provide email and password"
            })
        }

        const user = await User.findOne({email})
        if(!user || !user.password){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password."
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Login successful",
            data:{
                _id:user._id,
                name:user.name,
                email:user.email,
                isVerified:user.isVerified
            }
        })
    }catch(error:any){
        logger.error(`Login error: ${error.message}`)
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}
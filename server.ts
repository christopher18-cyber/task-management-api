import "dotenv/config"
import express from "express"
import helmet from "helmet";
import userRouter from "./routes/userRoutes.js"
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";
import { connectToDB } from "./database/db.js";


const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

connectToDB()

app.use("/api/user",userRouter)
app.listen(PORT,()=>{
    logger.info(`Server is running on ${PORT}`)
})
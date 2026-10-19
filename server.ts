import "dotenv/config"
import express from "express"
import helmet from "helmet";
import logger from "./utils/logger.js";
import { connectToDB } from "./database/db.js";


const app = express()

const PORT = process.env.PORT || 3000

connectToDB()

app.listen(PORT,()=>{
    logger.info(`Server is running on ${PORT}`)
})
import "dotenv/config"
import winston from "winston"


const logger = winston.createLogger({
    level:process.env.NODE_ENV === "production" ? "info" : "debug",
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stacks:true}),
        winston.format.json()
    ),
    defaultMeta:{service:"TASK_MANAGEMENT_API"},
    transports:[
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ) 
}),
new winston.transports.File({
    level:"error.log",
    filename:"error"
}),
new winston.transports.File({
    filename:"combined.log"
})
    ]
})

export default logger
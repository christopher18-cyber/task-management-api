import { CorsOptions } from "cors";

// Define allowed origins (local development + your future production frontend domain)
const allowedOrigins = [
    "http://localhost:5173",
    "https://task-management-frontend-ecru-seven.vercel.app"
];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman, mobile apps, or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS policy: Origin not allowed."));
        }
    },
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
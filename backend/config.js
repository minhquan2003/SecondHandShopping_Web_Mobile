import dotenv from "dotenv";

dotenv.config(); // Tải biến môi trường từ tệp .env

export const PORT = process.env.PORT || 5555;
export const mongodbconn = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || "defaultsecretkey";
export const IP = "http://192.168.2.225:5555" || "http://localhost:5555";
//192.168.1.248
// "start": "node index.js",
// "dev": "nodemon index.js"
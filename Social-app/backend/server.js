import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); //To parse Json data in the req.body
app.use(express.urlencoded({extended: false})) //To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
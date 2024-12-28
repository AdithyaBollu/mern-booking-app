// 1/2/2024

import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users'
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { availableParallelism } from 'os';
import path from "path";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
// Tells express to use the Cookie parser module
app.use(cookieParser());
// automatically converts api data to json
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(7000, () => {
    console.log("server is running on localhost 7000");
});

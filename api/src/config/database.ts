import mongoose from "mongoose";
import dotenv from "dotenv";

//import { logger } from "./logger";

dotenv.config();

export async function connect() {
    const url : any = process.env.DATABASE;

    try {
        await mongoose.connect(url);
    } catch (error) {
        //logger.error("Could not connect to database");

        console.log("Could not connect to database");

        process.exit(1);
    }
}
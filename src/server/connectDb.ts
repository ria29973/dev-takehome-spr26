import mongoose from "mongoose";

export default async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log("Connected to MongoDB!");
    } catch (e) {
        console.log("Unable to connect", e);
    }
}
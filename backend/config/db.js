const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables!");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        isConnected = conn.connections[0].readyState === 1;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        // Do NOT call process.exit() — it kills Vercel serverless functions
    }
};

module.exports = connectDB;
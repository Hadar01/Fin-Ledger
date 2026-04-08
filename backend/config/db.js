const mongoose = require("mongoose");

const connectDB = async () => {
    // If connection is already open (readyState === 1) or connecting (readyState === 2), return immediately
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables!");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
    }
};

module.exports = connectDB;

module.exports = connectDB;
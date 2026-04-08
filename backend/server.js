require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// CORS — allow all origins
app.use(cors());


app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Export for Vercel serverless
module.exports = app;

// Only start the server locally (Vercel uses the exported app)
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

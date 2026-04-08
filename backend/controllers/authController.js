const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, username, password } = req.body;

    // Validation: Check for missing fields
    if (!fullName || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }


        // Create the user
        const user = await User.create({
            fullName,
            username,
            password,  
        });

        await user.save();

        // Generate a token
        const token = generateToken(user._id);

        // Send the response with user and token
        res.status(201).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
            },
            token,
        });
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

// Login User
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validation: Check for missing fields
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) { return res.status(400).json({ message: "User not found" }) }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) { return res.status(400).json({ message: "Invalid credentials" }) }
        

        res.status(200).json({ 
            id: user._id,
            user,
            token: generateToken(user._id),    
        });
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
}

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
}

import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Route to create an Admin user (for testing purposes)
export const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required.", success: false });
        }

        // Check if the user already exists
        const existingUser = await Admin.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists.", success: false });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new admin
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        return res.status(201).json({ message: "Admin registered successfully", success: true });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};



// For admin login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Incoming request body:", req.body);

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required.", success: false });
        }

        const user = await Admin.findOne({ username });
        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isPasswordMatch);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect username or password.", success: false });
        }
        

        // Generate a JWT token
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.username}`,
            user: { _id: user._id, username: user.username },
            success: true
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


// For logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


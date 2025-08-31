import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import clientPromise from "../../../lib/mongodb";
import User from "../../../models/user";
import Profile from "../../../models/Profile";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Connect Mongoose if not connected
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Create empty profile linked to user
    await Profile.create({
      name: newUser.name,
      email: newUser.email,
      bio: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      skills: [],
      education: [],
      experience: [],
      projects: [],
      createdBy: newUser._id.toString(), // store as string
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: newUser._id.toString(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
}

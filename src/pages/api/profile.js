import mongoose from "mongoose";
import clientPromise, { getDatabase } from "../../lib/mongodb";
import Profile from "../../models/Profile";
import User from "../../models/user";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    // ✅ Connect Mongoose if not connected
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB);
    }

    // ✅ Get token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find logged-in user
    const user = await User.findById(token.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    switch (req.method) {
      // ---------------- GET PROFILE ----------------
      case "GET": {
        let profile = await Profile.findOne({ createdBy: user._id.toString() });

        // If no profile exists, create a blank one
        if (!profile) {
          profile = await Profile.create({
            name: token.name || user.name || "",
            email: user.email,
            bio: "",
            location: "",
            website: "",
            github: "",
            linkedin: "",
            skills: [],
            education: [],
            experience: [],
            projects: [],
            createdBy: user._id.toString(),
          });
        }

        return res.status(200).json(profile);
      }

      // ---------------- UPDATE PROFILE ----------------
      case "PUT": {
        const profile = await Profile.findOneAndUpdate(
          { createdBy: user._id.toString() },
          req.body,
          {
            new: true,
            runValidators: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        return res.status(200).json(profile);
      }

      // ---------------- PROJECTS CRUD ----------------
      case "POST": {
        const { action, projectData, projectId } = req.body;
        let profile;

        if (action === "addProject") {
          profile = await Profile.findOneAndUpdate(
            { createdBy: user._id.toString() },
            { $push: { projects: projectData } },
            { new: true, runValidators: true }
          );
        } else if (action === "updateProject") {
          profile = await Profile.findOneAndUpdate(
            { createdBy: user._id.toString(), "projects._id": projectId },
            { $set: { "projects.$": projectData } },
            { new: true, runValidators: true }
          );
        } else if (action === "deleteProject") {
          profile = await Profile.findOneAndUpdate(
            { createdBy: user._id.toString() },
            { $pull: { projects: { _id: projectId } } },
            { new: true }
          );
        } else {
          return res.status(400).json({ error: "Invalid action" });
        }

        if (!profile) {
          return res.status(404).json({ error: "Profile not found" });
        }

        return res.status(200).json(profile);
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Profile API Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
}

import mongoose from "mongoose";
import Profile from "../../../models/Profile";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB);
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) return res.status(401).json({ error: "Unauthorized" });

    const profile = await Profile.findOne({ createdBy: token.id });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.projects = profile.projects || [];

    switch (req.method) {
      case "GET":
        return res.status(200).json(profile.projects);

      case "POST": {
        const { title, description, skills, githubUrl, demoUrl, imageUrl } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        let skillsArray = [];
        if (skills !== undefined) {
          if (Array.isArray(skills)) {
            skillsArray = skills.filter(s => s && typeof s === "string" && s.trim() !== "");
          } else if (typeof skills === "string") {
            skillsArray = skills.split(",").map(s => s.trim()).filter(s => s !== "");
          }
        }

        const newProject = {
          title,
          description: description || "",
          skills: skillsArray,
          githubUrl: githubUrl || "",
          demoUrl: demoUrl || "",
          imageUrl: imageUrl || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        profile.projects.push(newProject);
        await profile.save();

        return res.status(201).json(profile.projects[profile.projects.length - 1]);
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error("API Error /projects:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

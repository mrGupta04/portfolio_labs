import mongoose from "mongoose";
import Profile from "../../../models/Profile";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    // ✅ Connect Mongoose
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB);
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.query;
    const projectId = Array.isArray(id) ? id[0] : id;

    const profile = await Profile.findOne({ createdBy: token.id });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.projects = profile.projects || [];

    const projectIndex = profile.projects.findIndex(
      (p) => p._id && p._id.toString() === projectId
    );
    if (projectIndex === -1) return res.status(404).json({ error: "Project not found" });

    switch (req.method) {
      case "GET":
        return res.status(200).json(profile.projects[projectIndex]);

      case "PUT": {
        const { title, description, skills, githubUrl, demoUrl, imageUrl } = req.body;

        if (title !== undefined) profile.projects[projectIndex].title = title;
        if (description !== undefined) profile.projects[projectIndex].description = description;

        if (skills !== undefined) {
          let skillsArray = [];
          if (Array.isArray(skills)) {
            skillsArray = skills.filter(s => s && typeof s === "string" && s.trim() !== "");
          } else if (typeof skills === "string") {
            skillsArray = skills.split(",").map(s => s.trim()).filter(s => s !== "");
          }
          profile.projects[projectIndex].skills = skillsArray;
        }

        if (githubUrl !== undefined) profile.projects[projectIndex].githubUrl = githubUrl;
        if (demoUrl !== undefined) profile.projects[projectIndex].demoUrl = demoUrl;
        if (imageUrl !== undefined) profile.projects[projectIndex].imageUrl = imageUrl;

        profile.projects[projectIndex].updatedAt = new Date();

        await profile.save();
        return res.status(200).json(profile.projects[projectIndex]);
      }

      case "DELETE": {
        profile.projects.splice(projectIndex, 1);
        await profile.save();
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error("API Error /projects/[id]:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

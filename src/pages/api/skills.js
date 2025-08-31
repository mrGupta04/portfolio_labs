import mongoose from "mongoose";
import Profile from "../../models/Profile";
import User from "../../models/user";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    // ✅ Connect Mongoose if not connected
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB || process.env.MONGODB);
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

    if (req.method === 'GET') {
      try {
        const profile = await Profile.findOne({ createdBy: user._id });
        if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
        }

        // Count skill frequencies from all projects
        const skillCounts = {};
        if (profile.projects && Array.isArray(profile.projects)) {
          profile.projects.forEach(project => {
            if (project.skills && Array.isArray(project.skills)) {
              project.skills.forEach(skill => {
                const normalizedSkill = skill.toLowerCase().trim();
                if (normalizedSkill) {
                  skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
                }
              });
            }
          });
        }

        const topSkills = Object.entries(skillCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        res.status(200).json(topSkills);
      } catch (error) {
        console.error("Error fetching skill stats:", error);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Skill Stats API Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
  }
}
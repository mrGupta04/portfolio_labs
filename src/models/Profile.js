import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  period: String,
  description: String,
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  period: String,
  description: String,
});

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    skills: [String],
    githubUrl: String,
    demoUrl: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    skills: [{ type: String }],
    education: [EducationSchema],
    experience: [ExperienceSchema],
    projects: { type: [ProjectSchema], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Profile ||
  mongoose.model("Profile", ProfileSchema);

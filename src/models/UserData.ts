import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string;
}

export interface ILeadership {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IExperience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface IProject {
  name: string;
  description: string;
  techStack: string;
  link: string;
}

export interface ICertification {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface IUserData extends Document {
  userId: string; // Supabase user ID
  email: string;
  
  // Step 1: Personal Info
  fullName: string;
  phone: string;
  location: string;
  linkedin: string;
  githubPortfolio: string;
  objective: string;
  
  // Step 2: Education
  education: IEducation[];
  relevantCoursework: string;
  
  // Step 3: Leadership/Extracurricular
  leadership: ILeadership[];
  
  // Step 4: Experience
  experience: IExperience[];
  
  // Step 5: Skills
  skills: string;
  
  // Step 6: Projects
  projects: IProject[];
  
  // Step 7: Certifications
  certifications: ICertification[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  achievements: { type: String, default: '' }
});

const LeadershipSchema = new Schema({
  title: { type: String, default: '' },
  organization: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' }
});

const ExperienceSchema = new Schema({
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' }
});

const ProjectSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  techStack: { type: String, default: '' },
  link: { type: String, default: '' }
});

const CertificationSchema = new Schema({
  title: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' }
});

const UserDataSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  
  // Personal Info
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  githubPortfolio: { type: String, default: '' },
  objective: { type: String, default: '' },
  
  // Education
  education: [EducationSchema],
  relevantCoursework: { type: String, default: '' },
  
  // Leadership
  leadership: [LeadershipSchema],
  
  // Experience
  experience: [ExperienceSchema],
  
  // Skills
  skills: { type: String, default: '' },
  
  // Projects
  projects: [ProjectSchema],
  
  // Certifications
  certifications: [CertificationSchema]
}, {
  timestamps: true
});

export default mongoose.models.UserData || mongoose.model<IUserData>('UserData', UserDataSchema);

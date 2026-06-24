import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { DbService } from './services/db.js';
import { AiService } from './services/ai.js';
import { JobService } from './services/jobs.js';
import authRouter, { authMiddleware, AuthenticatedRequest } from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Middleware to extract API key from headers if provided
const getApiKey = (req: express.Request): string | undefined => {
  const headerKey = req.headers['x-gemini-key'];
  if (typeof headerKey === 'string' && headerKey.trim() !== '') {
    return headerKey;
  }
  return undefined;
};

// ─── Auth Router ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ─── Profile Routes ──────────────────────────────────────────────────────────

app.get('/api/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await DbService.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: "Failed to read profile" });
  }
});

app.post('/api/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const updated = await DbService.saveProfile(req.user!.id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

app.post('/api/profile/upload', authMiddleware, upload.single('resume'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const parsedPdf = await pdfParse(pdfBuffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({ error: "Failed to extract text from PDF" });
    }

    const apiKey = getApiKey(req);
    const parsedProfile = await AiService.parseResumeText(resumeText, apiKey);
    
    // Save to DB as the current profile
    const saved = await DbService.saveProfile(req.user!.id, parsedProfile);
    res.json(saved);
  } catch (e: any) {
    console.error("Resume upload/parsing error:", e);
    res.status(500).json({ error: e.message || "Failed to parse resume" });
  }
});

// ─── Job Routes ──────────────────────────────────────────────────────────────

app.get('/api/jobs', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await DbService.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const jobs = JobService.getMatchedJobs(profile.skills, profile.prefs);
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: "Failed to get jobs" });
  }
});

app.post('/api/jobs/analyze', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { jobTitle, company, skills, missing } = req.body;
    const profile = await DbService.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const matchedCount = skills.length;
    const totalCount = skills.length + missing.length;
    const coverage = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

    // Build some high-quality feedback points
    const whyPoints = [
      `Your skills in ${skills.slice(0, 3).join(', ')} directly align with the core requirements.`,
      profile.experience && profile.experience.length > 0 
        ? `Your previous experience as ${profile.experience[0].role} at ${profile.experience[0].co} provides relevant domain context.`
        : "You have a solid technical background to tackle these responsibilities.",
      profile.college ? `Your education at ${profile.college} matches standard recruitment criteria.` : ""
    ].filter(Boolean);

    const improvements = missing.map((s: string) => `Learn ${s} to increase your matching probability by ~10% for this role.`);
    if (improvements.length === 0) {
      improvements.push("You match 100% of the listed requirements! Refine your resume details to stand out.");
    }

    res.json({
      whyPoints,
      improvements,
      coverage
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to analyze job match" });
  }
});

// ─── Resume Customizer ───────────────────────────────────────────────────────

app.post('/api/resume/customize', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { jobTitle, company, jobDesc } = req.body;
    const profile = await DbService.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const apiKey = getApiKey(req);

    // Format experience details for the AI prompt
    const expText = profile.experience.map((e: any) => 
      `Role: ${e.role} at ${e.co} (${e.period})\nDescription: ${e.desc}`
    ).join('\n\n');

    const customized = await AiService.customizeResume(jobTitle, company, jobDesc, expText, apiKey);
    res.json(customized);
  } catch (e: any) {
    console.error("Resume customization error:", e);
    res.status(500).json({ error: e.message || "Failed to customize resume" });
  }
});

// ─── Application Drafts ──────────────────────────────────────────────────────

app.post('/api/drafts/generate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { jobTitle, company, jobDesc } = req.body;
    const profile = await DbService.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const apiKey = getApiKey(req);

    const drafts = await AiService.generateDrafts(jobTitle, company, jobDesc, profile, apiKey);
    res.json(drafts);
  } catch (e: any) {
    console.error("Draft generation error:", e);
    res.status(500).json({ error: e.message || "Failed to generate drafts" });
  }
});

// ─── Self Improvement Roadmap ───────────────────────────────────────────────

app.get('/api/improve/roadmap', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await DbService.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const jobs = JobService.getMatchedJobs(profile.skills, profile.prefs);
    const roadmap = JobService.getSkillsRoadmap(profile.skills, jobs);
    
    // Add default weekly insights
    const weeklyInsights = [
      `You match 70%+ of requirements in ${jobs.filter(j => j.match >= 70).length} available roles.`,
      `Learning ${roadmap[0]?.skill || 'new skills'} will unlock additional higher-paying opportunities.`,
      `Profile completion is at ${profile.completion}% (add more projects/certifications to reach 90%).`
    ];

    res.json({
      roadmap,
      weeklyInsights
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to get roadmap" });
  }
});

// Initialize database then start server
DbService.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database:", err);
});

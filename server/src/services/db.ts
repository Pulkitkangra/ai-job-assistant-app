import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial state matching mock data
const DEFAULT_PROFILE = {
  name: "Priya Kapoor", 
  title: "B.Tech CSE · 3rd Year", 
  college: "BITS Pilani",
  email: "priya.kapoor@bits.ac.in", 
  phone: "+91 98765 43210",
  avatar: "PK", 
  completion: 82,
  skills: ["Python", "React", "Node.js", "Machine Learning", "TypeScript", "PostgreSQL", "FastAPI", "Docker"],
  experience: [
    { role: "SWE Intern", co: "Meesho", period: "May–Jul 2024", desc: "Built seller analytics dashboard reducing load time by 40%." },
    { role: "ML Research Intern", co: "IISc Bangalore", period: "Dec 2023", desc: "Fine-tuned BERT for sentiment analysis; achieved 93% F1 score." },
  ],
  education: [{ deg: "B.Tech — CSE", inst: "BITS Pilani", year: "2022–2026", cgpa: "9.1/10" }],
  prefs: { roles: ["SWE Intern", "ML Engineer", "Full-Stack Dev"], locations: ["Bangalore", "Remote", "Hyderabad"], type: "Internship" },
  settings: {
    openaiKey: "",
    geminiKey: "",
    linkedinKey: "",
    platforms: {
      "LinkedIn": true,
      "Naukri": true,
      "Instahyre": true,
      "AngelList": true,
      "Google Careers": true,
      "Glassdoor": true
    },
    privacy: {
      shareData: true,
      allowAiRead: true,
      enableHistory: true
    }
  }
};

export class DbService {
  private static ensureDbExists() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_PROFILE, null, 2), 'utf-8');
    }
  }

  static getProfile() {
    this.ensureDbExists();
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading database file", e);
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: any) {
    this.ensureDbExists();
    try {
      const current = this.getProfile();
      const updated = { ...current, ...profile };
      
      // Re-calculate profile completion
      let score = 0;
      if (updated.name) score += 15;
      if (updated.email && updated.phone) score += 15;
      if (updated.education && updated.education.length > 0) score += 15;
      if (updated.skills && updated.skills.length > 0) score += 20;
      if (updated.experience && updated.experience.length > 0) score += 20;
      if (updated.prefs && updated.prefs.roles && updated.prefs.roles.length > 0) score += 15;
      updated.completion = Math.min(score, 100);

      fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
      return updated;
    } catch (e) {
      console.error("Error writing to database file", e);
      throw e;
    }
  }
}

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.sqlite');

let db: Database | null = null;

const DEFAULT_PROFILE = {
  name: "", 
  title: "", 
  college: "",
  email: "", 
  phone: "",
  avatar: "", 
  completion: 0,
  skills: [] as string[],
  experience: [] as any[],
  education: [] as any[],
  prefs: { roles: [] as string[], locations: [] as string[], type: "Internship" }
};

const DEFAULT_SETTINGS = {
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
};

export class DbService {
  static async init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run("PRAGMA foreign_keys = ON;");

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER UNIQUE NOT NULL,
        name TEXT,
        title TEXT,
        college TEXT,
        email TEXT,
        phone TEXT,
        avatar TEXT,
        completion INTEGER DEFAULT 0,
        skills TEXT, -- JSON array
        experience TEXT, -- JSON array
        education TEXT, -- JSON array
        prefs TEXT, -- JSON object
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settings (
        user_id INTEGER UNIQUE NOT NULL,
        openaiKey TEXT,
        geminiKey TEXT,
        linkedinKey TEXT,
        platforms TEXT, -- JSON object
        privacy TEXT, -- JSON object
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    console.log("SQLite database initialized successfully.");
  }
  
  static getDb() {
    if (!db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    return db;
  }

  // --- Auth operations ---
  static async getUserByEmail(email: string) {
    const database = this.getDb();
    return await database.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
  }

  static async getUserById(id: number) {
    const database = this.getDb();
    return await database.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  static async createUser(email: string, passwordHash: string) {
    const database = this.getDb();
    const formattedEmail = email.toLowerCase().trim();
    
    const result = await database.run(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [formattedEmail, passwordHash]
    );
    
    const userId = result.lastID;
    if (!userId) {
      throw new Error("Failed to insert user.");
    }

    // Initialize default profile and settings for new user
    const avatarInit = formattedEmail.slice(0, 2).toUpperCase();
    await database.run(
      `INSERT INTO profiles (user_id, name, title, college, email, phone, avatar, completion, skills, experience, education, prefs)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        "",
        "",
        "",
        formattedEmail,
        "",
        avatarInit,
        0,
        JSON.stringify(DEFAULT_PROFILE.skills),
        JSON.stringify(DEFAULT_PROFILE.experience),
        JSON.stringify(DEFAULT_PROFILE.education),
        JSON.stringify(DEFAULT_PROFILE.prefs)
      ]
    );

    await database.run(
      `INSERT INTO settings (user_id, openaiKey, geminiKey, linkedinKey, platforms, privacy)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        "",
        "",
        "",
        JSON.stringify(DEFAULT_SETTINGS.platforms),
        JSON.stringify(DEFAULT_SETTINGS.privacy)
      ]
    );

    return userId;
  }
  static async getProfile(userId: number) {
    const database = this.getDb();
    const row = await database.get("SELECT * FROM profiles WHERE user_id = ?", [userId]);
    if (!row) {
      return null;
    }

    const settings = await this.getSettings(userId);

    return {
      name: row.name || "",
      title: row.title || "",
      college: row.college || "",
      email: row.email || "",
      phone: row.phone || "",
      avatar: row.avatar || "",
      completion: row.completion || 0,
      skills: row.skills ? JSON.parse(row.skills) : [],
      experience: row.experience ? JSON.parse(row.experience) : [],
      education: row.education ? JSON.parse(row.education) : [],
      prefs: row.prefs ? JSON.parse(row.prefs) : DEFAULT_PROFILE.prefs,
      settings: settings || DEFAULT_SETTINGS
    };
  }

  static async saveProfile(userId: number, profileData: any) {
    const database = this.getDb();
    
    // Save settings if nested in profileData
    if (profileData.settings) {
      await this.saveSettings(userId, profileData.settings);
    }

    const current = await this.getProfile(userId);
    if (!current) {
      throw new Error("Profile not found for user.");
    }

    const updated = { ...current, ...profileData };

    // Re-calculate profile completion
    let score = 0;
    if (updated.name) score += 15;
    if (updated.email && updated.phone) score += 15;
    if (updated.education && updated.education.length > 0) score += 15;
    if (updated.skills && updated.skills.length > 0) score += 20;
    if (updated.experience && updated.experience.length > 0) score += 20;
    if (updated.prefs && updated.prefs.roles && updated.prefs.roles.length > 0) score += 15;
    updated.completion = Math.min(score, 100);

    await database.run(
      `UPDATE profiles SET
        name = ?,
        title = ?,
        college = ?,
        email = ?,
        phone = ?,
        avatar = ?,
        completion = ?,
        skills = ?,
        experience = ?,
        education = ?,
        prefs = ?
       WHERE user_id = ?`,
      [
        updated.name,
        updated.title,
        updated.college,
        updated.email,
        updated.phone,
        updated.avatar,
        updated.completion,
        JSON.stringify(updated.skills),
        JSON.stringify(updated.experience),
        JSON.stringify(updated.education),
        JSON.stringify(updated.prefs),
        userId
      ]
    );

    // Get final profile with settings
    return await this.getProfile(userId);
  }

  // --- Settings operations ---
  static async getSettings(userId: number) {
    const database = this.getDb();
    const row = await database.get("SELECT * FROM settings WHERE user_id = ?", [userId]);
    if (!row) {
      return null;
    }

    return {
      openaiKey: row.openaiKey || "",
      geminiKey: row.geminiKey || "",
      linkedinKey: row.linkedinKey || "",
      platforms: row.platforms ? JSON.parse(row.platforms) : DEFAULT_SETTINGS.platforms,
      privacy: row.privacy ? JSON.parse(row.privacy) : DEFAULT_SETTINGS.privacy
    };
  }

  static async saveSettings(userId: number, settingsData: any) {
    const database = this.getDb();
    const current = await this.getSettings(userId);
    if (!current) {
      throw new Error("Settings not found for user.");
    }

    const updated = { ...current, ...settingsData };

    await database.run(
      `UPDATE settings SET
        openaiKey = ?,
        geminiKey = ?,
        linkedinKey = ?,
        platforms = ?,
        privacy = ?
       WHERE user_id = ?`,
      [
        updated.openaiKey,
        updated.geminiKey,
        updated.linkedinKey,
        JSON.stringify(updated.platforms),
        JSON.stringify(updated.privacy),
        userId
      ]
    );

    return updated;
  }
}

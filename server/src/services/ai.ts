import { GoogleGenerativeAI } from "@google/generative-ai";

function getClient(userApiKey?: string) {
  const key = userApiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API key is required. Please set it in Settings or the server's .env file.");
  }
  return new GoogleGenerativeAI(key);
}

export class AiService {
  static async parseResumeText(text: string, userApiKey?: string) {
    const ai = getClient(userApiKey);
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an expert ATS (Applicant Tracking System) parser. Parse the following resume text and return a JSON object that strictly adheres to this schema:
{
  "name": "Full Name",
  "title": "A short tagline, e.g. 'Software Engineering Student' or 'Full-Stack Developer'",
  "college": "College/University Name",
  "email": "Email Address",
  "phone": "Phone Number",
  "skills": ["Skill 1", "Skill 2", "Skill 3", ...],
  "experience": [
    {
      "role": "Role Title",
      "co": "Company Name",
      "period": "Duration, e.g. 'May - Jul 2024'",
      "desc": "A summary of achievements and responsibilities"
    }
  ],
  "education": [
    {
      "deg": "Degree, e.g. 'B.Tech — CSE'",
      "inst": "Institution/College Name",
      "year": "Period, e.g. '2022–2026'",
      "cgpa": "CGPA or percentage, e.g. '9.1/10'"
    }
  ],
  "prefs": {
    "roles": ["SWE Intern", "Full-Stack Dev"],
    "locations": ["Bangalore", "Remote"],
    "type": "Internship"
  }
}

Parse as much as you can. If a field (like email or prefs) is not present, infer reasonable values or leave it empty, but make sure the JSON matches the schema exactly.

Resume Text:
${text}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  static async customizeResume(jobTitle: string, company: string, jobDesc: string, originalResumeText: string, userApiKey?: string) {
    const ai = getClient(userApiKey);
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an AI resume coach. Analyze the following job description and the user's original resume details.
You need to customize the user's experience bullet points and write a brief summary tailored for this job.
Optimize for ATS matching, using keywords from the job description naturally, and quantify impacts where possible.

Job: ${jobTitle} at ${company}
Job Description:
${jobDesc}

Original Resume / Experience details:
${originalResumeText}

Return a JSON object with this exact structure:
{
  "summary": "Tailored professional summary (approx 2-3 lines)",
  "customBullets": [
    "Optimized bullet point 1, incorporating relevant keywords and showing quantified metrics",
    "Optimized bullet point 2...",
    "Optimized bullet point 3...",
    "Optimized bullet point 4..."
  ],
  "changesSummary": {
    "bulletsEnhanced": 4,
    "keywordsAdded": 10,
    "scoreImprovement": "15%"
  }
}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  static async generateDrafts(jobTitle: string, company: string, jobDesc: string, userProfile: any, userApiKey?: string) {
    const ai = getClient(userApiKey);
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are a career assistant. Generate three personalized outreach drafts for the following job and applicant profile:

Job: ${jobTitle} at ${company}
Job Description:
${jobDesc}

Applicant Profile:
${JSON.stringify(userProfile, null, 2)}

Return a JSON object with this exact structure:
{
  "email": "A professional cover letter / job application email with Subject and Body",
  "linkedin": "A short, engaging LinkedIn connection request / message to a recruiter (under 300 characters)",
  "followup": "A polite follow-up email to check on the application status a week later"
}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}

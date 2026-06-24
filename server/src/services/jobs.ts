interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  remote: 'Remote' | 'On-site' | 'Hybrid';
  stipend: string;
  platform: string;
  posted: string;
  skills: string[]; // Required skills
  desc: string;
  sector: string;
}

const JOB_POOL: Job[] = [
  { id: 1, title: "Software Engineer Intern", company: "Stripe", location: "Bangalore", remote: "Hybrid", stipend: "₹1.2L/mo", platform: "LinkedIn", posted: "1h ago", skills: ["Node.js", "TypeScript", "PostgreSQL", "React"], desc: "Build payment infrastructure powering millions of businesses globally.", sector: "Fintech" },
  { id: 2, title: "ML Engineer Intern", company: "Google DeepMind", location: "Hyderabad", remote: "On-site", stipend: "₹1.4L/mo", platform: "Google Careers", posted: "3h ago", skills: ["Python", "PyTorch", "Machine Learning", "TensorFlow"], desc: "Work on frontier AI research with the DeepMind team.", sector: "AI/ML" },
  { id: 3, title: "Full Stack Intern", company: "Razorpay", location: "Bangalore", remote: "Hybrid", stipend: "₹90K/mo", platform: "Instahyre", posted: "1d ago", skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Redis"], desc: "Build financial products serving 100M+ transactions.", sector: "Fintech" },
  { id: 4, title: "Backend Engineer Intern", company: "CRED", location: "Bangalore", remote: "On-site", stipend: "₹80K/mo", platform: "AngelList", posted: "1d ago", skills: ["Python", "FastAPI", "Docker", "PostgreSQL", "Kafka"], desc: "Design APIs powering CRED's premium financial ecosystem.", sector: "Fintech" },
  { id: 5, title: "SDE Intern — Platform", company: "Flipkart", location: "Bangalore", remote: "On-site", stipend: "₹85K/mo", platform: "LinkedIn", posted: "2d ago", skills: ["Python", "Docker", "Java", "Kubernetes"], desc: "Work on seller platform infrastructure at scale.", sector: "E-Commerce" },
  { id: 6, title: "Data Science Intern", company: "PhonePe", location: "Remote", remote: "Remote", stipend: "₹70K/mo", platform: "Naukri", posted: "2d ago", skills: ["Python", "Machine Learning", "SQL", "Spark", "Tableau"], desc: "Analyze transaction patterns and build fraud detection models.", sector: "Fintech" },
  { id: 7, title: "Frontend Engineer Intern", company: "Swiggy", location: "Bangalore", remote: "Hybrid", stipend: "₹65K/mo", platform: "LinkedIn", posted: "3d ago", skills: ["React", "TypeScript", "JavaScript", "GraphQL", "Redux"], desc: "Build consumer app features for 20M+ weekly active users.", sector: "FoodTech" },
  { id: 8, title: "Research Intern — NLP", company: "Microsoft Research", location: "Hyderabad", remote: "On-site", stipend: "₹1.1L/mo", platform: "Microsoft", posted: "3d ago", skills: ["Python", "Machine Learning", "PyTorch", "HuggingFace", "CUDA"], desc: "Contribute to low-resource NLP research at MSR India.", sector: "AI/ML" },
  { id: 9, title: "DevOps Intern", company: "Atlassian", location: "Remote", remote: "Remote", stipend: "₹95K/mo", platform: "Glassdoor", posted: "4d ago", skills: ["Docker", "Python", "Kubernetes", "Terraform", "CI/CD"], desc: "Automate deployment pipelines for Atlassian cloud products.", sector: "SaaS" },
  { id: 10, title: "Product Engineer Intern", company: "Zepto", location: "Mumbai", remote: "On-site", stipend: "₹75K/mo", platform: "Instahyre", posted: "5d ago", skills: ["React", "Node.js", "JavaScript", "React Native", "MongoDB"], desc: "Build features for Zepto's 10-minute delivery platform.", sector: "QCommerce" },
  { id: 11, title: "AI/ML SDE Intern", company: "Cohere", location: "Remote", remote: "Remote", stipend: "₹1.5L/mo", platform: "LinkedIn", posted: "6h ago", skills: ["Python", "PyTorch", "Machine Learning", "FastAPI"], desc: "Build large language model APIs and search retrieval pipelines.", sector: "AI/ML" },
  { id: 12, title: "Software Engineer — Backend", company: "Postman", location: "Bangalore", remote: "Hybrid", stipend: "₹95K/mo", platform: "Instahyre", posted: "1d ago", skills: ["Node.js", "TypeScript", "PostgreSQL", "Docker"], desc: "Scaling runtime API execution services serving millions of devs.", sector: "SaaS" },
  { id: 13, title: "Systems Engineer Intern", company: "NVIDIA", location: "Pune", remote: "On-site", stipend: "₹1.3L/mo", platform: "NVIDIA Careers", posted: "2d ago", skills: ["Python", "C++", "Docker", "CUDA"], desc: "Optimize GPU accelerated pipelines for deep learning applications.", sector: "Hardware/AI" },
  { id: 14, title: "Frontend SDE Intern", company: "Groww", location: "Bangalore", remote: "On-site", stipend: "₹70K/mo", platform: "LinkedIn", posted: "2d ago", skills: ["React", "TypeScript", "TailwindCSS"], desc: "Build sleek financial charts and order execution dashboards.", sector: "Fintech" },
  { id: 15, title: "Software Engineer", company: "Unacademy", location: "Remote", remote: "Remote", stipend: "₹60K/mo", platform: "Naukri", posted: "4d ago", skills: ["Node.js", "React", "PostgreSQL", "Redis"], desc: "Work on live learning platform APIs and streaming services.", sector: "EdTech" }
];

export class JobService {
  static getMatchedJobs(userSkills: string[], userPrefs?: any) {
    const skillsLower = userSkills.map(s => s.toLowerCase());

    const matchedJobs = JOB_POOL.map(job => {
      const jobSkillsLower = job.skills.map(s => s.toLowerCase());
      
      // Calculate matching and missing skills
      const matchingSkills = job.skills.filter(s => skillsLower.includes(s.toLowerCase()));
      const missingSkills = job.skills.filter(s => !skillsLower.includes(s.toLowerCase()));
      
      // Base match score: ratio of matching skills
      let score = 0;
      if (job.skills.length > 0) {
        score = Math.round((matchingSkills.length / job.skills.length) * 100);
      }

      // Preference boosts
      if (userPrefs) {
        // Boost for preferred roles
        if (userPrefs.roles && userPrefs.roles.some((r: string) => job.title.toLowerCase().includes(r.toLowerCase()))) {
          score += 5;
        }
        // Boost for preferred location
        if (userPrefs.locations && userPrefs.locations.some((l: string) => job.location.toLowerCase().includes(l.toLowerCase()) || (l.toLowerCase() === 'remote' && job.remote === 'Remote'))) {
          score += 5;
        }
      }

      // Clamp score between 10 and 99
      score = Math.max(10, Math.min(99, score));

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        stipend: job.stipend,
        platform: job.platform,
        posted: job.posted,
        skills: matchingSkills,
        missing: missingSkills,
        desc: job.desc,
        sector: job.sector,
        match: score
      };
    });

    // Sort by match score descending
    return matchedJobs.sort((a, b) => b.match - a.match);
  }

  static getSkillsRoadmap(userSkills: string[], matchedJobs: any[]) {
    // Find all missing skills from jobs where match score is relatively high (>60)
    const highMatchJobs = matchedJobs.filter(j => j.match >= 50);
    const missingSkillCounts: Record<string, number> = {};

    highMatchJobs.forEach(job => {
      job.missing.forEach((skill: string) => {
        missingSkillCounts[skill] = (missingSkillCounts[skill] || 0) + 1;
      });
    });

    const roadmapTemplates: Record<string, any> = {
      "TensorFlow": { priority: "High", time: "3 weeks", progress: 20, resources: ["TF Official Docs", "Coursera DL Specialization"] },
      "Kubernetes": { priority: "High", time: "2 weeks", progress: 0, resources: ["K8s.io Docs", "CKAD Course"] },
      "GraphQL": { priority: "Medium", time: "1 week", progress: 45, resources: ["HowToGraphQL", "Apollo Docs"] },
      "Redis": { priority: "Medium", time: "4 days", progress: 10, resources: ["Redis.io", "Redis University"] },
      "HuggingFace": { priority: "High", time: "2 weeks", progress: 35, resources: ["HF Course", "Transformers Docs"] },
      "Docker": { priority: "High", time: "1 week", progress: 60, resources: ["Docker Docs", "Docker for Beginners"] },
      "Kafka": { priority: "Medium", time: "2 weeks", progress: 15, resources: ["Kafka Documentation", "Confluent Developer"] },
      "PyTorch": { priority: "High", time: "3 weeks", progress: 40, resources: ["PyTorch Tutorials", "Deep Learning with PyTorch"] },
      "TypeScript": { priority: "Medium", time: "1 week", progress: 75, resources: ["TS Playground", "TypeScript Deep Dive"] },
      "Terraform": { priority: "Medium", time: "2 weeks", progress: 0, resources: ["HashiCorp Learn", "Terraform Up & Running"] }
    };

    const roadmap = Object.entries(missingSkillCounts).map(([skill, count]) => {
      const template = roadmapTemplates[skill] || {
        priority: count >= 3 ? "High" : "Medium",
        time: "2 weeks",
        progress: 0,
        resources: [`${skill} Official Docs`, `Intro to ${skill}`]
      };

      return {
        skill,
        priority: template.priority,
        why: `Required in ${count} target roles`,
        time: template.time,
        progress: template.progress,
        resources: template.resources
      };
    });

    // If we have very few roadmap items, add default high priority missing items
    if (roadmap.length === 0) {
      return [
        { skill: "TensorFlow", priority: "High", why: "Boosts AI/ML engineering match score by 18%", time: "3 weeks", progress: 20, resources: ["TF Official Docs", "Coursera DL Specialization"] },
        { skill: "Kubernetes", priority: "High", why: "Crucial for backend/infrastructure roles", time: "2 weeks", progress: 0, resources: ["K8s.io Docs", "CKAD Course"] },
        { skill: "Redis", priority: "Medium", why: "Required in 3 fintech/SaaS roles", time: "4 days", progress: 10, resources: ["Redis.io", "Redis University"] }
      ];
    }

    // Sort by priority (High first) and count descending
    return roadmap.sort((a, b) => {
      if (a.priority === b.priority) return 0;
      return a.priority === "High" ? -1 : 1;
    });
  }
}

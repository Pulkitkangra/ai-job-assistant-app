import { useState, createContext, useContext, useEffect } from "react";
import {
  LayoutDashboard, User, Search, FileText, BarChart3, Wand2,
  Mail, TrendingUp, Settings, ChevronRight, Star, ExternalLink,
  Upload, Download, Copy, Save, CheckCircle2, XCircle, Sparkles,
  Brain, Target, Zap, BookOpen, Code2, Globe, MapPin, Building2,
  Clock, ArrowRight, Sun, Moon, Menu, X, Bell, RefreshCw,
  Award, Lightbulb, Play, Plus, Minus, Check, AlertCircle,
  GraduationCap, Briefcase, Phone, AtSign, ChevronDown, Shield,
  BarChart2, PieChart, Layers, Lock, Eye, Trash2, LogOut,
} from "lucide-react";

// ─── Theme Context ─────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: true, toggle: () => {} });

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Priya Kapoor", title: "B.Tech CSE · 3rd Year", college: "BITS Pilani",
  email: "priya.kapoor@bits.ac.in", phone: "+91 98765 43210",
  avatar: "PK", completion: 82,
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

const MOCK_JOBS = [
  { id: 1, title: "Software Engineer Intern", company: "Stripe", location: "Bangalore", remote: "Hybrid", match: 97, stipend: "₹1.2L/mo", platform: "LinkedIn", posted: "1h ago", skills: ["Node.js", "TypeScript", "PostgreSQL"], missing: [], desc: "Build payment infrastructure powering millions of businesses globally.", sector: "Fintech" },
  { id: 2, title: "ML Engineer Intern", company: "Google DeepMind", location: "Hyderabad", remote: "On-site", match: 93, stipend: "₹1.4L/mo", platform: "Google Careers", posted: "3h ago", skills: ["Python", "PyTorch", "Machine Learning"], missing: ["TensorFlow"], desc: "Work on frontier AI research with the DeepMind team.", sector: "AI/ML" },
  { id: 3, title: "Full Stack Intern", company: "Razorpay", location: "Bangalore", remote: "Hybrid", match: 89, stipend: "₹90K/mo", platform: "Instahyre", posted: "1d ago", skills: ["React", "Node.js", "PostgreSQL"], missing: ["Redis"], desc: "Build financial products serving 100M+ transactions.", sector: "Fintech" },
  { id: 4, title: "Backend Engineer Intern", company: "CRED", location: "Bangalore", remote: "On-site", match: 85, stipend: "₹80K/mo", platform: "AngelList", posted: "1d ago", skills: ["Python", "FastAPI", "Docker"], missing: ["Kafka"], desc: "Design APIs powering CRED's premium financial ecosystem.", sector: "Fintech" },
  { id: 5, title: "SDE Intern — Platform", company: "Flipkart", location: "Bangalore", remote: "On-site", match: 82, stipend: "₹85K/mo", platform: "LinkedIn", posted: "2d ago", skills: ["Python", "Docker"], missing: ["Java", "Kubernetes"], desc: "Work on seller platform infrastructure at scale.", sector: "E-Commerce" },
  { id: 6, title: "Data Science Intern", company: "PhonePe", location: "Remote", remote: "Remote", match: 78, stipend: "₹70K/mo", platform: "Naukri", posted: "2d ago", skills: ["Python", "Machine Learning"], missing: ["Spark", "Tableau"], desc: "Analyze transaction patterns and build fraud detection models.", sector: "Fintech" },
  { id: 7, title: "Frontend Engineer Intern", company: "Swiggy", location: "Bangalore", remote: "Hybrid", match: 75, stipend: "₹65K/mo", platform: "LinkedIn", posted: "3d ago", skills: ["React", "TypeScript"], missing: ["GraphQL", "Redux"], desc: "Build consumer app features for 20M+ weekly active users.", sector: "FoodTech" },
  { id: 8, title: "Research Intern — NLP", company: "Microsoft Research", location: "Hyderabad", remote: "On-site", match: 72, stipend: "₹1.1L/mo", platform: "Microsoft", posted: "3d ago", skills: ["Python", "Machine Learning"], missing: ["HuggingFace", "CUDA"], desc: "Contribute to low-resource NLP research at MSR India.", sector: "AI/ML" },
  { id: 9, title: "DevOps Intern", company: "Atlassian", location: "Remote", remote: "Remote", match: 68, stipend: "₹95K/mo", platform: "Glassdoor", posted: "4d ago", skills: ["Docker", "Python"], missing: ["Kubernetes", "Terraform", "CI/CD"], desc: "Automate deployment pipelines for Atlassian cloud products.", sector: "SaaS" },
  { id: 10, title: "Product Engineer Intern", company: "Zepto", location: "Mumbai", remote: "On-site", match: 65, stipend: "₹75K/mo", platform: "Instahyre", posted: "5d ago", skills: ["React", "Node.js"], missing: ["React Native", "MongoDB"], desc: "Build features for Zepto's 10-minute delivery platform.", sector: "QCommerce" },
];

const MOCK_SKILLS_ROADMAP = [
  { skill: "TensorFlow", priority: "High", why: "Required in 6 ML roles", time: "3 weeks", progress: 20, resources: ["TF Official Docs", "Coursera DL Specialization"] },
  { skill: "Kubernetes", priority: "High", why: "Required in 4 backend/DevOps roles", time: "2 weeks", progress: 0, resources: ["K8s.io Docs", "CKAD Course"] },
  { skill: "GraphQL", priority: "Medium", why: "Needed for 3 frontend roles", time: "1 week", progress: 45, resources: ["HowToGraphQL", "Apollo Docs"] },
  { skill: "Redis", priority: "Medium", why: "Boosts backend match scores by 12%", time: "4 days", progress: 10, resources: ["Redis.io", "Redis University"] },
  { skill: "HuggingFace", priority: "High", why: "Critical for NLP/Research roles", time: "2 weeks", progress: 35, resources: ["HF Course", "Transformers Docs"] },
];

const MOCK_WEEKLY_INSIGHTS = [
  "You applied to 3 roles this week — 2× improvement over last week",
  "TensorFlow learning progress: 20% complete",
  "Recommended: Add a FastAPI side project to boost backend match by 15%",
  "Your React skills match 7 out of 10 frontend roles — top 20% of candidates"
];

const USER = MOCK_USER;
const JOBS = MOCK_JOBS;
const SKILLS_ROADMAP = MOCK_SKILLS_ROADMAP;

const API_BASE = "http://localhost:3001/api";

export const AppContext = createContext<{
  user: typeof MOCK_USER;
  jobs: typeof MOCK_JOBS;
  roadmap: typeof MOCK_SKILLS_ROADMAP;
  weeklyInsights: string[];
  setUser: React.Dispatch<React.SetStateAction<typeof MOCK_USER>>;
  setJobs: React.Dispatch<React.SetStateAction<typeof MOCK_JOBS>>;
  setRoadmap: React.Dispatch<React.SetStateAction<typeof MOCK_SKILLS_ROADMAP>>;
  setWeeklyInsights: React.Dispatch<React.SetStateAction<string[]>>;
  backendActive: boolean;
}>({
  user: MOCK_USER,
  jobs: MOCK_JOBS,
  roadmap: MOCK_SKILLS_ROADMAP,
  weeklyInsights: MOCK_WEEKLY_INSIGHTS,
  setUser: () => {},
  setJobs: () => {},
  setRoadmap: () => {},
  setWeeklyInsights: () => {},
  backendActive: false
});


// ─── Utility Components ──────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function GlassCard({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  const { dark } = useContext(ThemeCtx);
  return (
    <div className={cn(
      "rounded-2xl border transition-all duration-300",
      dark ? "bg-white/[0.04] border-white/[0.08] backdrop-blur-xl" : "bg-white border-gray-200 shadow-sm",
      hover && (dark ? "hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-lg hover:shadow-indigo-500/5" : "hover:shadow-md hover:border-indigo-200"),
      className
    )}>
      {children}
    </div>
  );
}

function GradBtn({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }:
  { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" | "lg"; className?: string; disabled?: boolean }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur-sm",
    ghost: "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </button>
  );
}

function MatchRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? "#10b981" : score >= 70 ? "#6366f1" : "#f59e0b";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/25",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    red: "bg-red-500/15 text-red-300 border-red-500/25",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    slate: "bg-slate-500/15 text-slate-400 border-slate-500/25",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium", colors[color] ?? colors.indigo)}>
      {children}
    </span>
  );
}

function SkillTag({ name, variant = "have" }: { name: string; variant?: "have" | "missing" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border",
      variant === "have"
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20"
    )}>
      {variant === "have" ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
      {name}
    </span>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  const { dark } = useContext(ThemeCtx);
  return (
    <div className="mb-6">
      <h2 className={cn("text-2xl font-bold", dark ? "text-white" : "text-gray-900")}>{title}</h2>
      {sub && <p className={cn("text-sm mt-1", dark ? "text-slate-400" : "text-gray-500")}>{sub}</p>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <p className="text-slate-400 text-sm">AI is analyzing your profile…</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, cta, onCta }: { icon: React.ElementType; title: string; desc: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Icon className="w-8 h-8 text-indigo-400" />
      </div>
      <div>
        <p className="text-white font-semibold text-lg">{title}</p>
        <p className="text-slate-400 text-sm mt-1 max-w-xs">{desc}</p>
      </div>
      {cta && <GradBtn onClick={onCta}>{cta}</GradBtn>}
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }: { onStart: () => void }) {
  const { dark } = useContext(ThemeCtx);
  const features = [
    { icon: Brain, title: "AI Resume Analyzer", desc: "Instantly score your resume and get actionable AI suggestions to maximize recruiter attention.", color: "from-indigo-500 to-blue-600" },
    { icon: Target, title: "Job Match Finder", desc: "Scans 6+ platforms to surface the 10–20 best-fit jobs ranked by compatibility with your profile.", color: "from-purple-500 to-indigo-600" },
    { icon: Wand2, title: "Auto Resume Customizer", desc: "One click tailors your resume for each specific job description using advanced AI.", color: "from-pink-500 to-purple-600" },
    { icon: TrendingUp, title: "Skill Improvement Tracker", desc: "Identifies gaps between your skills and target roles, with a personalized learning roadmap.", color: "from-emerald-500 to-teal-600" },
    { icon: Mail, title: "Application Draft Generator", desc: "Generates professional emails, cover letters, and LinkedIn messages for every application.", color: "from-amber-500 to-orange-600" },
  ];

  const stats = [
    { val: "10K+", label: "Students Helped" },
    { val: "6", label: "Job Platforms" },
    { val: "94%", label: "Match Accuracy" },
    { val: "3×", label: "More Interviews" },
  ];

  return (
    <div className={cn("min-h-screen", dark ? "bg-[#070d1f]" : "bg-gray-50")}>
      {/* Nav */}
      <nav className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        dark ? "bg-[#070d1f]/80 border-white/08" : "bg-white/80 border-gray-200"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className={cn("text-lg font-bold", dark ? "text-white" : "text-gray-900")}>
              CareerPilot <span className="text-indigo-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <GradBtn onClick={onStart} size="sm">Get Started</GradBtn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Advanced AI
          </div>
          <h1 className={cn(
            "text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6",
            dark ? "text-white" : "text-gray-900"
          )}>
            Your Personal<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Career Assistant
            </span>
          </h1>
          <p className={cn("text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed", dark ? "text-slate-400" : "text-gray-600")}>
            Find best-fit jobs, optimize your resume, and grow your career automatically.
            Built for ambitious students, powered by intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <GradBtn onClick={onStart} size="lg" className="min-w-[160px]">
              Get Started <ArrowRight className="w-5 h-5" />
            </GradBtn>
            <GradBtn variant="secondary" size="lg" className="min-w-[160px]">
              <Play className="w-4 h-4" /> View Demo
            </GradBtn>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {stats.map((s) => (
              <GlassCard key={s.label} className="p-5 text-center">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{s.val}</p>
                <p className={cn("text-sm mt-1", dark ? "text-slate-400" : "text-gray-500")}>{s.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className={cn("text-3xl sm:text-4xl font-bold mb-4", dark ? "text-white" : "text-gray-900")}>
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Land Your Dream Job</span>
            </h2>
            <p className={cn("text-lg max-w-2xl mx-auto", dark ? "text-slate-400" : "text-gray-600")}>
              Five powerful AI tools working together seamlessly in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <GlassCard key={f.title} hover className={cn("p-6 group cursor-pointer", i === 4 && "sm:col-span-2 lg:col-span-1")}>
                <div className={cn(`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`)}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={cn("font-bold text-lg mb-2", dark ? "text-white" : "text-gray-900")}>{f.title}</h3>
                <p className={cn("text-sm leading-relaxed", dark ? "text-slate-400" : "text-gray-600")}>{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Start Your AI-Powered Career Journey</h2>
              <p className="text-indigo-200 mb-8 text-lg">Free for students. No credit card required.</p>
              <GradBtn onClick={onStart} size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl">
                Launch CareerPilot AI <ArrowRight className="w-5 h-5" />
              </GradBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn("border-t py-8 px-6 text-center text-sm", dark ? "border-white/08 text-slate-500" : "border-gray-200 text-gray-400")}>
        © 2024 CareerPilot AI · Built for students, by students
      </footer>
    </div>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeCtx);
  return (
    <button onClick={toggle} className={cn(
      "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
      dark ? "bg-white/10 text-yellow-400 hover:bg-white/15" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    )}>
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ navigate }: { navigate: (v: string) => void }) {
  const { dark } = useContext(ThemeCtx);
  const { user: USER, jobs: JOBS, roadmap: SKILLS_ROADMAP } = useContext(AppContext);
  const stats = [
    { label: "Jobs Found", value: String(JOBS.length), delta: "+12 today", icon: Search, grad: "from-indigo-500 to-blue-600" },
    { label: "Best Match", value: JOBS.length > 0 ? `${JOBS[0].match}%` : "0%", delta: JOBS.length > 0 ? `${JOBS[0].company} ${JOBS[0].title.split(' ')[0]}` : "None", icon: Target, grad: "from-purple-500 to-indigo-600" },
    { label: "Resume Score", value: `${USER.completion}/100`, delta: "+5 this week", icon: FileText, grad: "from-emerald-500 to-teal-600" },
    { label: "Applications", value: "4", delta: "2 pending", icon: Mail, grad: "from-amber-500 to-orange-600" },
  ];
  const quickActions = [
    { label: "Upload Resume", icon: Upload, page: "profile", color: "indigo" },
    { label: "Search Jobs", icon: Search, page: "jobs", color: "purple" },
    { label: "Customize Resume", icon: Wand2, page: "customizer", color: "emerald" },
    { label: "Generate Draft", icon: Mail, page: "draft", color: "amber" },
  ];
  const actColors: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600/80 to-purple-700/80 p-6 border border-indigo-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Welcome back 👋</p>
            <h2 className="text-2xl font-bold text-white mt-0.5">{USER.name}</h2>
            <p className="text-indigo-300 text-sm mt-1">{USER.title} · {USER.college}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-200 text-xs mb-2">Profile Completion</p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${USER.completion}%` }} />
              </div>
              <span className="text-white font-bold text-sm">{USER.completion}%</span>
            </div>
            <p className="text-indigo-300 text-xs mt-1">Add projects to reach 90%</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.label} hover className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", dark ? "text-white" : "text-gray-900")}>{s.value}</p>
            <p className={cn("text-xs mt-0.5", dark ? "text-slate-400" : "text-gray-500")}>{s.label}</p>
            <p className="text-xs text-indigo-400 mt-1 font-medium">{s.delta}</p>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-5">
        <h3 className={cn("text-sm font-semibold uppercase tracking-widest mb-4", dark ? "text-slate-400" : "text-gray-500")}>Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.page)}
              className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-sm font-medium", actColors[a.color])}>
              <a.icon className="w-5 h-5" />
              {a.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Matches */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>Top Job Matches</h3>
            <button onClick={() => navigate("jobs")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {JOBS.slice(0, 4).map((j) => (
              <div key={j.id} className={cn("flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer",
                dark ? "hover:bg-white/05" : "hover:bg-gray-50")}
                onClick={() => navigate("jobs")}>
                <MatchRing score={j.match} size={44} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold truncate", dark ? "text-white" : "text-gray-900")}>{j.title}</p>
                  <p className="text-xs text-slate-400">{j.company} · {j.location}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex-shrink-0">{j.stipend}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Skill Suggestions */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>Skill Suggestions</h3>
            <button onClick={() => navigate("improve")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Full roadmap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {SKILLS_ROADMAP.slice(0, 4).map((s) => (
              <div key={s.skill} className={cn("p-3 rounded-xl", dark ? "bg-white/03" : "bg-gray-50")}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn("text-sm font-medium", dark ? "text-white" : "text-gray-900")}>{s.skill}</span>
                  <Badge color={s.priority === "High" ? "red" : "amber"}>{s.priority}</Badge>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{s.why} · Est. {s.time}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const { dark } = useContext(ThemeCtx);
  const [tab, setTab] = useState<"details" | "preview">("details");
  const { user: USER, setUser, backendActive } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: USER.name || "",
    email: USER.email || "",
    phone: USER.phone || "",
    college: USER.college || "",
    title: USER.title || "",
    degree: USER.education?.[0]?.deg || "",
    inst: USER.education?.[0]?.inst || "",
    year: USER.education?.[0]?.year || "",
    cgpa: USER.education?.[0]?.cgpa || "",
    roles: USER.prefs?.roles?.join(", ") || "",
    locations: USER.prefs?.locations?.join(", ") || "",
    type: USER.prefs?.type || "Internship"
  });

  useEffect(() => {
    setFormData({
      name: USER.name || "",
      email: USER.email || "",
      phone: USER.phone || "",
      college: USER.college || "",
      title: USER.title || "",
      degree: USER.education?.[0]?.deg || "",
      inst: USER.education?.[0]?.inst || "",
      year: USER.education?.[0]?.year || "",
      cgpa: USER.education?.[0]?.cgpa || "",
      roles: USER.prefs?.roles?.join(", ") || "",
      locations: USER.prefs?.locations?.join(", ") || "",
      type: USER.prefs?.type || "Internship"
    });
  }, [USER]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("resume", file);

    try {
      const response = await fetch(`${API_BASE}/profile/upload`, {
        method: "POST",
        body: form,
        headers: {
          "x-gemini-key": USER.settings?.geminiKey || ""
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse resume");
      }
      const parsedData = await response.json();
      setUser(parsedData);
      alert("Resume parsed and profile updated successfully!");
    } catch (e: any) {
      console.error(e);
      alert("Error parsing resume: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...USER,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      title: formData.title,
      education: [{ deg: formData.degree, inst: formData.inst, year: formData.year, cgpa: formData.cgpa }],
      prefs: {
        roles: formData.roles.split(",").map(s => s.trim()).filter(Boolean),
        locations: formData.locations.split(",").map(s => s.trim()).filter(Boolean),
        type: formData.type
      }
    };

    if (backendActive) {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        });
        if (response.ok) {
          const saved = await response.json();
          setUser(saved);
          alert("Profile saved successfully!");
        } else {
          throw new Error("Failed to save to server");
        }
      } catch (e: any) {
        console.error(e);
        setUser(updatedUser);
        alert("Server error. Profile saved locally.");
      }
    } else {
      setUser(updatedUser);
      alert("Profile updated locally.");
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedUser = {
      ...USER,
      skills: USER.skills.filter(s => s !== skillToRemove)
    };
    setUser(updatedUser);
    if (backendActive) {
      try {
        await fetch(`${API_BASE}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const [newSkill, setNewSkill] = useState("");
  const handleAddSkill = async () => {
    if (!newSkill.trim() || USER.skills.includes(newSkill.trim())) return;
    const updatedUser = {
      ...USER,
      skills: [...USER.skills, newSkill.trim()]
    };
    setUser(updatedUser);
    setNewSkill("");
    if (backendActive) {
      try {
        await fetch(`${API_BASE}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const inputCls = cn(
    "w-full px-3 py-2 rounded-xl text-sm border outline-none transition-colors focus:ring-2 focus:ring-indigo-500/40",
    dark ? "bg-white/05 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
  );
  const labelCls = cn("block text-xs font-semibold mb-1.5 uppercase tracking-widest", dark ? "text-slate-400" : "text-gray-500");

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile & Resume" sub="Manage your details and let AI optimize your resume." />

      {/* Upload Banner */}
      <label className={cn("p-6 border-dashed border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-colors cursor-pointer text-center group block rounded-2xl",
        dark ? "bg-white/[0.04] border-white/[0.08]" : "bg-white border-gray-200 shadow-sm")}>
        <input type="file" onChange={handleFileUpload} accept=".pdf" className="hidden" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            {uploading ? <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" /> : <Upload className="w-7 h-7 text-indigo-400" />}
          </div>
          <div>
            <p className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>
              {uploading ? "AI Parsing Resume..." : "Upload Your Resume"}
            </p>
            <p className="text-sm text-slate-400 mt-0.5">PDF format — AI will parse and improve it</p>
          </div>
          <GradBtn size="sm" disabled={uploading}>
            {uploading ? "Parsing..." : "Choose PDF File"}
          </GradBtn>
        </div>
      </label>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/05 w-fit">
        {(["details", "preview"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white")}>
            {t === "details" ? "Edit Details" : "Resume Preview"}
          </button>
        ))}
      </div>

      {tab === "details" ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <GlassCard className="p-5">
              <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}><User className="w-4 h-4 text-indigo-400" /> Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input className={inputCls} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Title / Headline</label>
                  <input className={inputCls} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input className={inputCls} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}><GraduationCap className="w-4 h-4 text-indigo-400" /> Education</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Degree</label>
                  <input className={inputCls} value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Institution</label>
                  <input className={inputCls} value={formData.inst} onChange={e => setFormData({ ...formData, inst: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Year</label>
                  <input className={inputCls} value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>CGPA / %</label>
                  <input className={inputCls} value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}><Code2 className="w-4 h-4 text-indigo-400" /> Skills</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {USER.skills?.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm">
                    {s} <button type="button" onClick={() => handleRemoveSkill(s)} className="text-indigo-400 hover:text-red-400"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={cn(inputCls, "flex-1")} value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill…" />
                <GradBtn type="button" onClick={handleAddSkill} size="sm"><Plus className="w-4 h-4" /></GradBtn>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}><Briefcase className="w-4 h-4 text-indigo-400" /> Job Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Target Roles</label>
                  <input className={inputCls} value={formData.roles} onChange={e => setFormData({ ...formData, roles: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Preferred Locations</label>
                  <input className={inputCls} value={formData.locations} onChange={e => setFormData({ ...formData, locations: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Job Type</label>
                  <select className={inputCls} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    {["Internship", "Full-time", "Remote", "Hybrid"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </GlassCard>

            <GradBtn type="submit" className="w-full sm:w-auto">
              <Save className="w-4 h-4" /> Save Profile
            </GradBtn>
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="space-y-4">
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> AI Suggestions</h3>
              <div className="space-y-3">
                {[
                  { icon: AlertCircle, col: "amber", msg: "Add 2–3 GitHub projects to boost match score by ~18%" },
                  { icon: AlertCircle, col: "red", msg: "Profile photo missing — adds 34% more recruiter views" },
                  { icon: Lightbulb, col: "indigo", msg: "Add certifications (AWS/GCP) to qualify for 4 more roles" },
                  { icon: Check, col: "emerald", msg: "Strong internship experience — keep quantified impact!" },
                ].map((tip, i) => (
                  <div key={i} className={cn("flex items-start gap-2.5 p-3 rounded-xl",
                    tip.col === "amber" ? "bg-amber-500/08 border border-amber-500/15" :
                    tip.col === "red" ? "bg-red-500/08 border border-red-500/15" :
                    tip.col === "emerald" ? "bg-emerald-500/08 border border-emerald-500/15" :
                    "bg-indigo-500/08 border border-indigo-500/15"
                  )}>
                    <tip.icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5",
                      tip.col === "amber" ? "text-amber-400" : tip.col === "red" ? "text-red-400" : tip.col === "emerald" ? "text-emerald-400" : "text-indigo-400")} />
                    <p className="text-xs text-slate-300 leading-relaxed">{tip.msg}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-3">Profile Score</h3>
              <div className="flex items-center justify-center py-2">
                <MatchRing score={USER.completion} size={100} />
              </div>
              <div className="space-y-2 mt-3">
                {[["Personal Info", !!USER.name], ["Education", !!USER.education?.[0]?.deg], ["Skills", USER.skills?.length > 0], ["Experience", USER.experience?.length > 0], ["Projects", false], ["Certifications", false]].map(([l, done]) => (
                  <div key={String(l)} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{String(l)}</span>
                    {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </form>
      ) : (
        /* Resume Preview */
        <GlassCard className="p-6 max-w-3xl">
          <div className="border-b border-white/10 pb-5 mb-5">
            <h2 className="text-2xl font-bold text-white">{USER.name}</h2>
            <p className="text-indigo-400 font-medium mt-0.5">{USER.title}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><AtSign className="w-3 h-3" />{USER.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{USER.phone}</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" />github.com/priyakapoor</span>
            </div>
          </div>
          {[
            { head: "Skills", content: <div className="flex flex-wrap gap-1.5">{USER.skills?.map(s => <Badge key={s}>{s}</Badge>)}</div> },
            { head: "Experience", content: USER.experience?.map(e => <div key={e.role} className="mb-3"><div className="flex justify-between"><p className="text-white font-semibold text-sm">{e.role} · {e.co}</p><p className="text-slate-400 text-xs">{e.period}</p></div><p className="text-slate-300 text-sm mt-0.5">{e.desc}</p></div>) },
            { head: "Education", content: USER.education?.map(e => <div key={e.deg}><div className="flex justify-between"><p className="text-white font-semibold text-sm">{e.deg}</p><p className="text-slate-400 text-xs">{e.year}</p></div><p className="text-slate-400 text-xs">{e.inst} · CGPA {e.cgpa}</p></div>) },
          ].map(sec => (
            <div key={sec.head} className="mb-5">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-1 mb-3">{sec.head}</p>
              {sec.content}
            </div>
          ))}
          <div className="flex gap-2 pt-3 border-t border-white/10">
            <GradBtn size="sm"><Download className="w-3.5 h-3.5" /> Export PDF</GradBtn>
            <GradBtn variant="secondary" size="sm"><Copy className="w-3.5 h-3.5" /> Copy Text</GradBtn>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Job Search Page ──────────────────────────────────────────────────────────
function JobSearchPage({ onSelect }: { onSelect: (job: typeof JOBS[0]) => void }) {
  const { dark } = useContext(ThemeCtx);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(true);
  const [filterRole, setFilterRole] = useState("");
  const [filterRemote, setFilterRemote] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const { jobs: JOBS, setJobs, backendActive } = useContext(AppContext);

  const doSearch = async () => {
    setLoading(true);
    if (backendActive) {
      try {
        const response = await fetch(`${API_BASE}/jobs`);
        if (response.ok) {
          const matchedJobs = await response.json();
          setJobs(matchedJobs);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => { setLoading(false); setSearched(true); }, 1500);
  };

  const filtered = JOBS.filter(j => {
    if (filterRole && !j.title.toLowerCase().includes(filterRole.toLowerCase()) && !j.sector.toLowerCase().includes(filterRole.toLowerCase())) return false;
    if (filterRemote !== "All" && j.remote !== filterRemote) return false;
    if (filterPlatform !== "All" && j.platform !== filterPlatform) return false;
    return true;
  });

  const inputCls = cn("px-3 py-2 rounded-xl text-sm border outline-none transition-colors focus:ring-2 focus:ring-indigo-500/40",
    dark ? "bg-white/05 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50" : "bg-white border-gray-200 text-gray-900");

  return (
    <div className="space-y-5">
      <SectionHeader title="Job Search" sub={`AI found ${JOBS.length} best-match jobs across 6 platforms`} />

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-3">
          <input value={filterRole} onChange={e => setFilterRole(e.target.value)}
            className={cn(inputCls, "flex-1 min-w-[160px]")} placeholder="Role, skill, or sector…" />
          <select value={filterRemote} onChange={e => setFilterRemote(e.target.value)} className={inputCls}>
            {["All", "Remote", "On-site", "Hybrid"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className={inputCls}>
            {["All", "LinkedIn", "Google Careers", "Instahyre", "AngelList", "Naukri", "Glassdoor", "Microsoft"].map(o => <option key={o}>{o}</option>)}
          </select>
          <GradBtn onClick={doSearch} disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Scanning…" : "Scan Jobs"}
          </GradBtn>
        </div>
      </GlassCard>

      {loading ? <LoadingState /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="No matches found" desc="Try adjusting your filters or broadening your search." cta="Reset Filters" onCta={() => { setFilterRole(""); setFilterRemote("All"); setFilterPlatform("All"); }} />
          ) : filtered.map((j, i) => (
            <GlassCard key={j.id} hover className="p-5 group cursor-pointer" >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 hidden sm:block">
                  <MatchRing score={j.match} size={60} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-500">#{String(i+1).padStart(2,"0")}</span>
                        <h3 className={cn("text-base font-bold", dark ? "text-white" : "text-gray-900")}>{j.title}</h3>
                        <Badge color={j.match >= 90 ? "emerald" : j.match >= 75 ? "indigo" : "amber"}>
                          {j.match}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{j.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{j.posted}</span>
                        <Badge color="blue">{j.platform}</Badge>
                        <Badge color={j.remote === "Remote" ? "emerald" : j.remote === "Hybrid" ? "purple" : "slate"}>{j.remote}</Badge>
                      </div>
                    </div>
                    <span className="text-base font-bold text-emerald-400 flex-shrink-0">{j.stipend}</span>
                  </div>

                  <p className={cn("text-sm mt-2", dark ? "text-slate-300" : "text-gray-600")}>{j.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {j.skills.map(s => <SkillTag key={s} name={s} variant="have" />)}
                    {j.missing.map(s => <SkillTag key={s} name={s} variant="missing" />)}
                  </div>

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <GradBtn size="sm" onClick={() => onSelect(j)}>
                      <BarChart3 className="w-3.5 h-3.5" /> Analyze Match
                    </GradBtn>
                    <GradBtn variant="secondary" size="sm" onClick={() => onSelect(j)}>
                      <Wand2 className="w-3.5 h-3.5" /> Customize Resume
                    </GradBtn>
                    <a href={j.platform === "LinkedIn" ? "#" : "#"} target="_blank" rel="noopener noreferrer">
                      <GradBtn variant="ghost" size="sm">
                        <ExternalLink className="w-3.5 h-3.5" /> Apply
                      </GradBtn>
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Job Match Analysis ───────────────────────────────────────────────────────
function JobMatchPage({ job, navigate }: { job: typeof JOBS[0] | null; navigate: (v: string) => void }) {
  const { dark } = useContext(ThemeCtx);
  const { backendActive } = useContext(AppContext);
  const [whyPoints, setWhyPoints] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!job) return;
    
    // Set initial mock data as fallback
    setWhyPoints([
      "Your Python & ML skills directly match 3 of 4 required competencies",
      "IISc research experience signals strong analytical and research capability",
      "BITS Pilani tier aligns with company's campus recruitment preferences",
      "Meesho internship demonstrates production-level engineering experience",
    ]);
    setImprovements([
      `Learn ${job.missing[0] ?? "TensorFlow"} — est. 2–3 weeks via official docs`,
      "Add a quantified ML project to GitHub with benchmark metrics",
      "Tailor your summary to mention scalability and research impact",
    ]);

    if (backendActive) {
      setLoading(true);
      fetch(`${API_BASE}/jobs/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          skills: job.skills,
          missing: job.missing
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.whyPoints) setWhyPoints(data.whyPoints);
        if (data.improvements) setImprovements(data.improvements);
      })
      .catch(err => console.error("Error analyzing job match", err))
      .finally(() => setLoading(false));
    }
  }, [job, backendActive]);

  if (!job) return <EmptyState icon={Target} title="No job selected" desc="Go to Job Search and click Analyze Match on any job." cta="Search Jobs" onCta={() => navigate("jobs")} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("jobs")} className="text-slate-400 hover:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <SectionHeader title="Job Match Analysis" sub={`${job.title} · ${job.company}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Match Score */}
        <GlassCard className="p-6 flex flex-col items-center text-center gap-3">
          <MatchRing score={job.match} size={120} />
          <div>
            <p className={cn("text-xl font-bold", dark ? "text-white" : "text-gray-900")}>Match Score</p>
            <p className="text-sm text-slate-400 mt-0.5">{job.company} · {job.title}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Badge color={job.match >= 90 ? "emerald" : "indigo"}>{job.match >= 90 ? "Excellent Fit" : "Strong Fit"}</Badge>
            <Badge color="blue">{job.remote}</Badge>
            <Badge color="purple">{job.sector}</Badge>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{job.stipend}</div>
        </GlassCard>

        {/* Skills Analysis */}
        <GlassCard className="p-5">
          <h3 className={cn("font-semibold mb-4", dark ? "text-white" : "text-gray-900")}>Skills Analysis</h3>
          <div className="mb-3">
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-2">Matched Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map(s => <SkillTag key={s} name={s} variant="have" />)}
            </div>
          </div>
          <div>
            <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">Missing Skills</p>
            {job.missing.length > 0
              ? <div className="flex flex-wrap gap-1.5">{job.missing.map(s => <SkillTag key={s} name={s} variant="missing" />)}</div>
              : <p className="text-sm text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> All skills matched!</p>
            }
          </div>
          <div className="mt-4 pt-3 border-t border-white/08">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Skills coverage</span>
              <span>{Math.round(job.skills.length/(job.skills.length+job.missing.length)*100)}%</span>
            </div>
            <div className="h-2 bg-white/08 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{ width: `${Math.round(job.skills.length/(job.skills.length+job.missing.length)*100)}%` }} />
            </div>
          </div>
        </GlassCard>

        {/* Why Suitable */}
        <GlassCard className="p-5">
          <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
            <Brain className="w-4 h-4 text-purple-400" /> Why You're Suitable
          </h3>
          <div className="space-y-2.5">
            {whyPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{pt}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Improvements & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard className="p-5">
          <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
            <Lightbulb className="w-4 h-4 text-amber-400" /> Improvement Suggestions
          </h3>
          <div className="space-y-2.5">
            {improvements.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/08 border border-amber-500/15">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{s}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className={cn("font-semibold mb-4", dark ? "text-white" : "text-gray-900")}>Take Action</h3>
          <div className="space-y-3">
            <button onClick={() => navigate("customizer")} className={cn("w-full flex items-center justify-between p-4 rounded-xl border transition-all",
              dark ? "bg-indigo-500/08 border-indigo-500/20 hover:bg-indigo-500/15" : "bg-indigo-50 border-indigo-100 hover:bg-indigo-100")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className={cn("text-sm font-semibold", dark ? "text-white" : "text-gray-900")}>Generate Tailored Resume</p>
                  <p className="text-xs text-slate-400">AI customizes your resume for this role</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button onClick={() => navigate("draft")} className={cn("w-full flex items-center justify-between p-4 rounded-xl border transition-all",
              dark ? "bg-purple-500/08 border-purple-500/20 hover:bg-purple-500/15" : "bg-purple-50 border-purple-100 hover:bg-purple-100")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className={cn("text-sm font-semibold", dark ? "text-white" : "text-gray-900")}>Generate Cover Letter</p>
                  <p className="text-xs text-slate-400">Professional email + LinkedIn message</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <a href="#" target="_blank" rel="noopener noreferrer" className={cn("w-full flex items-center justify-between p-4 rounded-xl border transition-all",
              dark ? "bg-emerald-500/08 border-emerald-500/20 hover:bg-emerald-500/15" : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className={cn("text-sm font-semibold", dark ? "text-white" : "text-gray-900")}>Apply Directly</p>
                  <p className="text-xs text-slate-400">Opens {job.platform} job listing</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── Resume Customizer ────────────────────────────────────────────────────────
function ResumeCustomizerPage({ job }: { job: typeof JOBS[0] | null }) {
  const { dark } = useContext(ThemeCtx);
  const { user: USER, backendActive } = useContext(AppContext);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);

  const targetJob = job ?? JOBS[0];

  const [originalBullets, setOriginalBullets] = useState<string[]>([]);
  const [customBullets, setCustomBullets] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [changesSummary, setChangesSummary] = useState({
    bulletsEnhanced: 4,
    keywordsAdded: 11,
    scoreImprovement: "+19%"
  });

  useEffect(() => {
    // Populate original bullets from user experience
    if (USER.experience && USER.experience.length > 0) {
      setOriginalBullets(USER.experience.map((e: any) => e.desc));
    } else {
      setOriginalBullets([
        "Developed a seller analytics dashboard using React and Node.js",
        "Implemented ML models for product categorization using Python",
        "Worked on backend APIs and database optimization",
        "Contributed to frontend features for mobile app",
      ]);
    }
  }, [USER]);

  const generate = async () => {
    setGenerating(true);

    const fallbacks = [
      `Built high-performance seller analytics dashboard (React + Node.js) reducing page load by 40% — directly relevant to ${targetJob.company}'s ${targetJob.skills[0]} stack`,
      `Deployed ML classification models (Python + FastAPI) achieving 91% accuracy in production with 99.9% uptime`,
      `Optimized PostgreSQL queries handling 2M+ daily transactions, achieving 3× throughput improvement`,
      `Delivered customer-facing features serving 150K+ daily active users with zero downtime deployments`,
    ];

    if (backendActive) {
      try {
        const response = await fetch(`${API_BASE}/resume/customize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-gemini-key": USER.settings?.geminiKey || ""
          },
          body: JSON.stringify({
            jobTitle: targetJob.title,
            company: targetJob.company,
            jobDesc: targetJob.desc
          })
        });
        if (response.ok) {
          const data = await response.json();
          setCustomBullets(data.customBullets);
          setSummary(data.summary);
          if (data.changesSummary) {
            setChangesSummary({
              bulletsEnhanced: data.changesSummary.bulletsEnhanced,
              keywordsAdded: data.changesSummary.keywordsAdded,
              scoreImprovement: String(data.changesSummary.scoreImprovement).includes('%') ? data.changesSummary.scoreImprovement : `+${data.changesSummary.scoreImprovement}%`
            });
          }
          setDone(true);
        } else {
          throw new Error("API failed");
        }
      } catch (e) {
        console.error(e);
        setCustomBullets(fallbacks);
        setSummary(`Full-stack engineer and ML practitioner with production experience building scalable systems at Meesho (150K+ DAU) and research at IISc. Seeking to bring end-to-end engineering and AI expertise to ${targetJob.company}'s ${targetJob.sector} mission.`);
        setDone(true);
      } finally {
        setGenerating(false);
      }
    } else {
      setTimeout(() => {
        setCustomBullets(fallbacks);
        setSummary(`Full-stack engineer and ML practitioner with production experience building scalable systems at Meesho (150K+ DAU) and research at IISc. Seeking to bring end-to-end engineering and AI expertise to ${targetJob.company}'s ${targetJob.sector} mission.`);
        setGenerating(false);
        setDone(true);
      }, 1500);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SectionHeader title="Resume Customizer" sub={`Tailoring for: ${targetJob.title} @ ${targetJob.company}`} />
        <div className="flex gap-2">
          {done && <>
            <GradBtn size="sm" variant="secondary" onClick={() => setSaved(true)}>
              {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save Version</>}
            </GradBtn>
            <GradBtn size="sm"><Download className="w-3.5 h-3.5" /> Download PDF</GradBtn>
          </>}
        </div>
      </div>

      {!done && (
        <div className={cn("rounded-2xl p-5 border flex items-center justify-between gap-4",
          dark ? "bg-indigo-500/08 border-indigo-500/20" : "bg-indigo-50 border-indigo-100")}>
          <div>
            <p className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>Ready to customize your resume?</p>
            <p className="text-sm text-slate-400 mt-0.5">AI will analyze the JD and tailor every section for maximum match.</p>
          </div>
          <GradBtn onClick={generate} disabled={generating}>
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Customizing…</> : <><Wand2 className="w-4 h-4" /> Customize Now</>}
          </GradBtn>
        </div>
      )}

      {generating && <LoadingState />}

      {done && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Original */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-400">Original Resume</h3>
              <Badge color="slate">Unoptimized</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Experience — Meesho Intern</p>
                <ul className="space-y-1.5">
                  {originalBullets.map((b, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-slate-600 mt-0.5">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-white/08">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Summary</p>
                <p className="text-sm text-slate-300">Passionate developer with experience in web and ML projects.</p>
              </div>
            </div>
          </GlassCard>

          {/* Customized */}
          <GlassCard className="p-5 border-indigo-500/25">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">AI-Customized</h3>
              <Badge color="emerald">Optimized ✨</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2">Experience — Meesho Intern</p>
                <ul className="space-y-2">
                  {customBullets.map((b, i) => (
                    <li key={i} className={cn("text-sm flex items-start gap-2 p-2 rounded-lg",
                      dark ? "text-slate-200 bg-emerald-500/05 border border-emerald-500/10" : "text-gray-700 bg-emerald-50 border border-emerald-100")}>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-white/08">
                <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2">Summary</p>
                <p className={cn("text-sm p-2 rounded-lg border", dark ? "text-slate-200 bg-emerald-500/05 border-emerald-500/10" : "text-gray-700 bg-emerald-50 border-emerald-100")}>
                  {summary}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/08 flex gap-2">
              <GradBtn size="sm" variant="ghost"><Copy className="w-3.5 h-3.5" /> Copy Text</GradBtn>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Changes summary */}
      {done && (
        <GlassCard className="p-5">
          <h3 className={cn("font-semibold mb-3", dark ? "text-white" : "text-gray-900")}>Changes Made by AI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Sparkles, label: "Bullets enhanced", val: String(changesSummary.bulletsEnhanced), color: "indigo" },
              { icon: Target, label: "Keywords added", val: String(changesSummary.keywordsAdded), color: "emerald" },
              { icon: TrendingUp, label: "Score improvement", val: changesSummary.scoreImprovement, color: "purple" },
            ].map(item => (
              <div key={item.label} className={cn("p-4 rounded-xl border text-center",
                item.color === "indigo" ? "bg-indigo-500/08 border-indigo-500/20" :
                item.color === "emerald" ? "bg-emerald-500/08 border-emerald-500/20" :
                "bg-purple-500/08 border-purple-500/20")}>
                <item.icon className={cn("w-5 h-5 mx-auto mb-2",
                  item.color === "indigo" ? "text-indigo-400" : item.color === "emerald" ? "text-emerald-400" : "text-purple-400")} />
                <p className={cn("text-xl font-bold", dark ? "text-white" : "text-gray-900")}>{item.val}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Application Draft ────────────────────────────────────────────────────────
function ApplicationDraftPage({ job }: { job: typeof JOBS[0] | null }) {
  const { dark } = useContext(ThemeCtx);
  const { user: USER, backendActive } = useContext(AppContext);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "linkedin" | "followup">("email");
  const [copied, setCopied] = useState(false);

  const targetJob = job ?? JOBS[0];

  const [drafts, setDrafts] = useState({
    email: "",
    linkedin: "",
    followup: ""
  });

  const generate = async () => {
    setGenerating(true);

    const fallbacks = {
      email: `Subject: Application for ${targetJob.title} — Priya Kapoor, BITS Pilani (9.1 CGPA)\n\nDear Hiring Team,\n\nI am writing to express my keen interest in the ${targetJob.title} position at ${targetJob.company}. As a third-year Computer Science student at BITS Pilani with a CGPA of 9.1, I bring hands-on experience in ${targetJob.skills.join(", ")} through my internship at Meesho and research at IISc Bangalore.\n\nAt Meesho, I built a seller analytics dashboard that reduced page load time by 40% for 150K+ daily active users. My research at IISc involved fine-tuning BERT achieving 93% F1 — directly applicable to ${targetJob.company}'s engineering challenges.\n\nI am excited by ${targetJob.company}'s mission in ${targetJob.sector} and believe my technical background and ownership mindset align well with your team's culture.\n\nI would love to discuss how I can contribute. Please find my resume attached.\n\nWarm regards,\nPriya Kapoor\n+91 98765 43210 | priya.kapoor@bits.ac.in | github.com/priyakapoor`,
      linkedin: `Hi [Recruiter Name],\n\nI came across the ${targetJob.title} role at ${targetJob.company} and I'm very excited about the opportunity. I'm a 3rd-year CSE student at BITS Pilani (9.1 CGPA) with production experience in ${targetJob.skills[0]} and ${targetJob.skills[1] ?? "backend systems"} from my internship at Meesho.\n\nI'd love to connect and learn more about the role. Would you be open to a quick chat?\n\nThanks, Priya`,
      followup: `Subject: Follow-up: ${targetJob.title} Application — Priya Kapoor\n\nDear [Name],\n\nI wanted to follow up on my application for the ${targetJob.title} position submitted last week. I remain very enthusiastic about joining ${targetJob.company} and contributing to your ${targetJob.sector} initiatives.\n\nI'm happy to provide any additional information or schedule a call at your convenience.\n\nBest regards, Priya Kapoor`
    };

    if (backendActive) {
      try {
        const response = await fetch(`${API_BASE}/drafts/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-gemini-key": USER.settings?.geminiKey || ""
          },
          body: JSON.stringify({
            jobTitle: targetJob.title,
            company: targetJob.company,
            jobDesc: targetJob.desc
          })
        });
        if (response.ok) {
          const data = await response.json();
          setDrafts(data);
          setDone(true);
        } else {
          throw new Error("Drafts API failed");
        }
      } catch (e) {
        console.error(e);
        setDrafts(fallbacks);
        setDone(true);
      } finally {
        setGenerating(false);
      }
    } else {
      setTimeout(() => {
        setDrafts(fallbacks);
        setGenerating(false);
        setDone(true);
      }, 1500);
    }
  };

  const tabs = [
    { key: "email" as const, label: "Email Draft", icon: Mail },
    { key: "linkedin" as const, label: "LinkedIn Message", icon: Globe },
    { key: "followup" as const, label: "Follow-up", icon: RefreshCw },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Application Draft" sub={`Generating messages for: ${targetJob.title} @ ${targetJob.company}`} />

      {!done && (
        <GlassCard className="p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className={cn("text-lg font-bold mb-2", dark ? "text-white" : "text-gray-900")}>Generate Application Messages</h3>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            AI will create a professional email, LinkedIn message, and follow-up note — all tailored to {targetJob.company}.
          </p>
          <GradBtn onClick={generate} disabled={generating} size="lg">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate All Drafts</>}
          </GradBtn>
        </GlassCard>
      )}

      {generating && <LoadingState />}

      {done && (
        <>
          <div className="flex gap-1 p-1 rounded-xl bg-white/05 w-fit">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                  activeTab === t.key ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white")}>
                <t.icon className="w-3.5 h-3.5" />{t.label}
              </button>
            ))}
          </div>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>
                {tabs.find(t => t.key === activeTab)?.label}
              </h3>
              <div className="flex gap-2">
                <GradBtn size="sm" variant="ghost" onClick={copy}>
                  {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </GradBtn>
                <GradBtn size="sm" variant="secondary"><Save className="w-3.5 h-3.5" /> Save</GradBtn>
                <GradBtn size="sm"><Download className="w-3.5 h-3.5" /> Export</GradBtn>
              </div>
            </div>
            <pre className={cn("text-sm leading-relaxed whitespace-pre-wrap font-sans p-4 rounded-xl border",
              dark ? "bg-white/03 border-white/08 text-slate-300" : "bg-gray-50 border-gray-200 text-gray-700")}>
              {drafts[activeTab]}
            </pre>
          </GlassCard>
        </>
      )}
    </div>
  );
}

// ─── Self-Improvement Page ────────────────────────────────────────────────────
function ImprovePage() {
  const { dark } = useContext(ThemeCtx);
  const { roadmap: SKILLS_ROADMAP, weeklyInsights } = useContext(AppContext);

  return (
    <div className="space-y-5">
      <SectionHeader title="Self-Improvement" sub="AI-driven skill gap analysis and personalized learning roadmap" />

      {/* Weekly Insights */}
      <GlassCard className="p-5">
        <h3 className={cn("font-semibold mb-3 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
          <TrendingUp className="w-4 h-4 text-indigo-400" /> Weekly Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {weeklyInsights.map((ins, i) => (
            <div key={i} className={cn("flex items-start gap-2.5 p-3 rounded-xl border",
              dark ? "bg-white/03 border-white/08" : "bg-gray-50 border-gray-100")}>
              <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{ins}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Skill Roadmap */}
      <GlassCard className="p-5">
        <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
          <BookOpen className="w-4 h-4 text-purple-400" /> Skill Learning Roadmap
        </h3>
        <div className="space-y-4">
          {SKILLS_ROADMAP.map((s, i) => (
            <div key={s.skill} className={cn("p-4 rounded-xl border transition-all",
              dark ? "bg-white/03 border-white/08 hover:border-indigo-500/25" : "bg-gray-50 border-gray-100 hover:border-indigo-200")}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-500">#{i + 1}</span>
                    <h4 className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>{s.skill}</h4>
                    <Badge color={s.priority === "High" ? "red" : "amber"}>{s.priority} Priority</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{s.why} · Est. {s.time}</p>
                </div>
                <span className="text-sm font-bold text-indigo-400">{s.progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/08 rounded-full overflow-hidden mb-3">
                <div className={cn("h-full rounded-full bg-gradient-to-r",
                  s.progress > 0 ? "from-indigo-500 to-purple-500" : "from-slate-600 to-slate-500")}
                  style={{ width: `${Math.max(s.progress, 2)}%` }} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.resources.map(r => (
                  <a key={r} href="#" className="text-xs px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" /> {r}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Suggested Projects */}
      <GlassCard className="p-5">
        <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
          <Code2 className="w-4 h-4 text-emerald-400" /> Suggested Projects to Build
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "ML Pipeline with FastAPI", desc: "REST API serving a trained model in production", skills: ["Python", "FastAPI", "Docker"], impact: "+18% match" },
            { name: "Real-time Chat App", desc: "WebSocket backend with Redis pub/sub and React frontend", skills: ["Node.js", "Redis", "React"], impact: "+12% match" },
            { name: "NLP Text Classifier", desc: "HuggingFace fine-tune + evaluation dashboard", skills: ["Python", "HuggingFace", "PyTorch"], impact: "+22% match" },
          ].map((p) => (
            <div key={p.name} className={cn("p-4 rounded-xl border",
              dark ? "bg-white/03 border-white/08" : "bg-gray-50 border-gray-100")}>
              <h4 className={cn("font-semibold text-sm mb-1", dark ? "text-white" : "text-gray-900")}>{p.name}</h4>
              <p className="text-xs text-slate-400 mb-2">{p.desc}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {p.skills.map(s => <Badge key={s} color="indigo">{s}</Badge>)}
              </div>
              <p className="text-xs font-semibold text-emerald-400">{p.impact} score</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage() {
  const { dark, toggle } = useContext(ThemeCtx);
  const { user: USER, setUser, backendActive } = useContext(AppContext);
  const [saved, setSaved] = useState(false);

  const [openaiKey, setOpenaiKey] = useState(USER.settings?.openaiKey || "");
  const [geminiKey, setGeminiKey] = useState(USER.settings?.geminiKey || "");
  const [linkedinKey, setLinkedinKey] = useState(USER.settings?.linkedinKey || "");

  const [platforms, setPlatforms] = useState(USER.settings?.platforms || {
    "LinkedIn": true,
    "Naukri": true,
    "Instahyre": true,
    "AngelList": true,
    "Google Careers": true,
    "Glassdoor": true
  });

  const [privacy, setPrivacy] = useState(USER.settings?.privacy || {
    shareData: true,
    allowAiRead: true,
    enableHistory: true
  });

  const handleSaveSettings = async () => {
    const updatedUser = {
      ...USER,
      settings: {
        openaiKey,
        geminiKey,
        linkedinKey,
        platforms,
        privacy
      }
    };

    setUser(updatedUser);

    if (backendActive) {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser)
        });
        if (response.ok) {
          const savedData = await response.json();
          setUser(savedData);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = cn("w-full px-3 py-2 rounded-xl text-sm border outline-none transition-colors focus:ring-2 focus:ring-indigo-500/40",
    dark ? "bg-white/05 border-white/10 text-white placeholder:text-slate-500" : "bg-gray-50 border-gray-200 text-gray-900");
  const labelCls = cn("block text-xs font-semibold mb-1.5 uppercase tracking-widest", dark ? "text-slate-400" : "text-gray-500");

  return (
    <div className="space-y-5">
      <SectionHeader title="Settings" sub="Manage API keys, preferences, and privacy controls" />

      {/* Theme */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              {dark ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className={cn("font-semibold", dark ? "text-white" : "text-gray-900")}>Theme</p>
              <p className="text-xs text-slate-400">{dark ? "Dark Mode — active" : "Light Mode — active"}</p>
            </div>
          </div>
          <GradBtn variant="secondary" onClick={toggle} size="sm">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            Switch to {dark ? "Light" : "Dark"}
          </GradBtn>
        </div>
      </GlassCard>

      {/* API Configuration */}
      <GlassCard className="p-5">
        <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
          <Code2 className="w-4 h-4 text-indigo-400" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Gemini API Key</label>
            <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} className={inputCls} placeholder="Enter Gemini API key (recommended)" />
          </div>
          <div>
            <label className={labelCls}>OpenAI API Key</label>
            <input type="password" value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} className={inputCls} placeholder="sk-..." />
          </div>
          <div>
            <label className={labelCls}>LinkedIn API Key</label>
            <input type="password" value={linkedinKey} onChange={e => setLinkedinKey(e.target.value)} className={inputCls} placeholder="Enter LinkedIn API key" />
          </div>
        </div>
      </GlassCard>

      {/* Job Platforms */}
      <GlassCard className="p-5">
        <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}>
          <Globe className="w-4 h-4 text-purple-400" />
          Job Platforms
        </h3>
        <div className="space-y-2">
          {Object.keys(platforms).map(p => (
            <div key={p} className="flex items-center justify-between">
              <span className={cn("text-sm", dark ? "text-slate-300" : "text-gray-700")}>{p}</span>
              <div className="relative inline-flex items-center cursor-pointer" onClick={() => setPlatforms({ ...platforms, [p]: !platforms[p] })}>
                <input type="checkbox" checked={platforms[p]} readOnly className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-600 rounded-full peer peer-checked:bg-indigo-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Privacy */}
      <GlassCard className="p-5">
        <h3 className={cn("font-semibold mb-4 flex items-center gap-2", dark ? "text-white" : "text-gray-900")}><Shield className="w-4 h-4 text-red-400" /> Data & Privacy</h3>
        <div className="space-y-3">
          {[
            { key: "shareData" as const, label: "Share anonymized data for AI improvement", icon: Eye },
            { key: "allowAiRead" as const, label: "Allow AI to read resume for auto-fill", icon: Brain },
            { key: "enableHistory" as const, label: "Enable job search history", icon: Search },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-slate-400" />
                <span className={cn("text-sm", dark ? "text-slate-300" : "text-gray-700")}>{item.label}</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer" onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key] })}>
                <input type="checkbox" checked={privacy[item.key]} readOnly className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-600 rounded-full peer peer-checked:bg-indigo-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/08 flex gap-2">
          <GradBtn variant="danger" size="sm"><Trash2 className="w-3.5 h-3.5" /> Delete All Data</GradBtn>
          <GradBtn variant="ghost" size="sm"><LogOut className="w-3.5 h-3.5" /> Sign Out</GradBtn>
        </div>
      </GlassCard>

      <GradBtn onClick={handleSaveSettings}>
        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
      </GradBtn>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Job Search", icon: Search },
  { id: "analysis", label: "Match Analysis", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: User },
  { id: "customizer", label: "Customizer", icon: Wand2 },
  { id: "draft", label: "App. Draft", icon: Mail },
  { id: "improve", label: "Improve", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
];

function AppShell({ onLanding }: { onLanding: () => void }) {
  const { dark } = useContext(ThemeCtx);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof MOCK_JOBS[0] | null>(null);
  const [notifs, setNotifs] = useState(3);

  // App Context states
  const [user, setUser] = useState(MOCK_USER);
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [roadmap, setRoadmap] = useState(MOCK_SKILLS_ROADMAP);
  const [weeklyInsights, setWeeklyInsights] = useState(MOCK_WEEKLY_INSIGHTS);
  const [backendActive, setBackendActive] = useState(false);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const profileRes = await fetch(`${API_BASE}/profile`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
          setBackendActive(true);

          const jobsRes = await fetch(`${API_BASE}/jobs`);
          if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            setJobs(jobsData);
          }

          const improveRes = await fetch(`${API_BASE}/improve/roadmap`);
          if (improveRes.ok) {
            const improveData = await improveRes.json();
            setRoadmap(improveData.roadmap);
            setWeeklyInsights(improveData.weeklyInsights);
          }
        }
      } catch (e) {
        console.log("Backend offline, running in mock fallback mode.");
        setBackendActive(false);
      }
    };
    initFetch();
  }, []);

  const USER = user;
  const JOBS = jobs;

  const navigate = (v: string) => { setView(v); setSidebarOpen(false); };
  const selectJob = (j: typeof JOBS[0]) => { setSelectedJob(j); navigate("analysis"); };

  const bg = dark ? "bg-[#070d1f]" : "bg-gray-50";
  const sidebar = dark ? "bg-[#0b1120] border-white/08" : "bg-white border-gray-200";
  const navItem = (active: boolean) => cn(
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
    active
      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/25"
      : dark ? "text-slate-400 hover:text-white hover:bg-white/05" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
  );

  const renderView = () => {
    switch (view) {
      case "dashboard": return <Dashboard navigate={navigate} />;
      case "profile": return <ProfilePage />;
      case "jobs": return <JobSearchPage onSelect={selectJob} />;
      case "analysis": return <JobMatchPage job={selectedJob} navigate={navigate} />;
      case "customizer": return <ResumeCustomizerPage job={selectedJob} />;
      case "draft": return <ApplicationDraftPage job={selectedJob} />;
      case "improve": return <ImprovePage />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <AppContext.Provider value={{ user, jobs, roadmap, weeklyInsights, setUser, setJobs, setRoadmap, setWeeklyInsights, backendActive }}>
      <div className={cn("min-h-screen flex flex-col", bg)} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Top Bar */}
        <header className={cn("sticky top-0 z-40 border-b backdrop-blur-xl flex-shrink-0",
          dark ? "bg-[#070d1f]/80 border-white/08" : "bg-white/80 border-gray-200")}>
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className={cn("lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                dark ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button onClick={onLanding} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className={cn("text-sm font-bold hidden sm:block", dark ? "text-white" : "text-gray-900")}>
                  CareerPilot <span className="text-indigo-400">AI</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn("hidden sm:flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 font-medium",
                backendActive 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", backendActive ? "bg-emerald-400" : "bg-amber-400")} />
                {backendActive ? "AI Active" : "Mock Mode"}
              </div>
              <button onClick={() => setNotifs(0)} className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: dark ? "rgba(255,255,255,0.05)" : "#f3f4f6" }}>
                <Bell className={cn("w-4 h-4", dark ? "text-slate-400" : "text-gray-500")} />
                {notifs > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">{notifs}</span>}
              </button>
              <ThemeToggle />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
                {USER.avatar}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className={cn(
            "fixed inset-y-0 left-0 z-30 w-60 border-r flex flex-col pt-14 transition-transform duration-300 lg:static lg:translate-x-0 lg:pt-0 lg:z-auto",
            sidebar,
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex flex-col h-full p-3 overflow-y-auto">
              {/* Profile Card */}
              <div className={cn("p-3 rounded-xl mb-3 mt-2", dark ? "bg-white/03" : "bg-gray-50")}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {USER.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", dark ? "text-white" : "text-gray-900")}>{USER.name}</p>
                    <p className="text-xs text-slate-400 truncate">{USER.college}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Profile</span>
                    <span className="text-indigo-400 font-semibold">{USER.completion}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${USER.completion}%` }} />
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <button key={item.id} onClick={() => navigate(item.id)} className={navItem(view === item.id)}>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Bottom Card */}
              <div className="mt-auto pt-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/20">
                  <p className="text-xs font-semibold text-indigo-300 mb-0.5">{JOBS.length > 0 ? `${JOBS.filter(j => j.match >= 80).length} hot matches` : "Scan for jobs"}</p>
                  <p className="text-xs text-slate-400">{JOBS.length > 0 ? `Best: ${JOBS[0].match}% at ${JOBS[0].company}` : "Find suitable roles"}</p>
                  <button onClick={() => navigate("jobs")} className="text-xs text-indigo-400 mt-1.5 flex items-center gap-1 hover:text-indigo-300">
                    View jobs <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Overlay */}
          {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* Main Content */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-6xl mx-auto pb-24 lg:pb-6">
              {renderView()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className={cn("lg:hidden fixed bottom-0 inset-x-0 z-40 border-t flex justify-around py-2 px-2",
          dark ? "bg-[#0b1120]/95 border-white/08 backdrop-blur-xl" : "bg-white/95 border-gray-200 backdrop-blur-xl")}>
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={cn("flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[52px]",
                view === item.id ? "text-indigo-400" : dark ? "text-slate-500" : "text-gray-400")}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </AppContext.Provider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState<"landing" | "app">("landing");

  useEffect(() => {
    document.documentElement.style.setProperty("--background", dark ? "#070d1f" : "#f8fafc");
    document.documentElement.style.setProperty("--foreground", dark ? "#e8edf8" : "#0f172a");
    document.documentElement.style.setProperty("--card", dark ? "rgba(255,255,255,0.04)" : "#ffffff");
    document.documentElement.style.setProperty("--border", dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)");
    document.documentElement.style.setProperty("--muted-foreground", dark ? "#64748b" : "#6b7280");
  }, [dark]);

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {page === "landing"
        ? <LandingPage onStart={() => setPage("app")} />
        : <AppShell onLanding={() => setPage("landing")} />
      }
    </ThemeCtx.Provider>
  );
}

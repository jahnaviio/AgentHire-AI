// Type declarations for AgentHire AI Application

export interface UserProfile {
  name: string;
  email?: string;
  role: string;
  difficulty?: "Beginner" | "Intermediate" | "Experienced";
}

export interface Interviewer {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  avatarChar: string;
  description: string;
  voiceName: string;
  personality: string;
  avatarColor: string; // Tailwind bg color
}

export interface Question {
  id: string;
  question: string;
  category: string; // 'Beginner' | 'Intermediate' | 'Advanced' | 'Technical' | 'Behavioral' | 'Scenario-Based'
  difficulty: string; // 'Junior' | 'Mid' | 'Senior' | 'Principal'
  modelAnswer: string;
  tips: string;
}

export interface PrepPack {
  roleSummary: string;
  questions: Question[];
  rolePrepTips: string[];
}

export interface InterviewLog {
  question: string;
  answer: string;
}

// Computer Vision telemetry
export interface RealtimeCVMetrics {
  eyeContact: number; // 0 - 100
  facialExpression: string; // e.g. "Engaged", "Calm", "Smiling", "Nervous"
  attentionLevel: number; // 0 - 100
  headMovement: string; // "Stable", "Nodding", "Fidgety"
  postureScore: number; // 0 - 100
  smileFrequency: number; // e.g. times per minute
  nervousBehavior: number; // 0 - 100 (high fidgeting)
  engagementScore: number; // 0 - 100
}

export interface SpeechMetrics {
  speakingSpeed: number; // WPM
  voiceClarity: number; // 0 - 100
  fillersCount: number; // count of um/uh/actually/like
  fluencyScore: number; // 0 - 100
  vocabularyUsage: string; // "Diverse", "Appropriate", "Common"
  confidenceScore: number; // 0 - 100
}

export interface MultiAgentAssessment {
  overallScore: number;
  scores: {
    technical: number;
    communication: number;
    confidence: number;
    behavioral: number;
    hrReadiness: number;
  };
  agentAssessments: {
    technicalAgent: string;
    communicationAgent: string;
    behavioralAgent: string;
    hrAgent: string;
    confidenceAgent: string;
  };
  strengths: string[];
  improvements: string[];
  actionableSteps: string[];
  sampleBetterAnswers: {
    question: string;
    weakPoints: string;
    improvedAnswer: string;
  }[];
  hiringRecommendation: "Strong Hire" | "Hire" | "Borderline" | "Needs Improvement";
}

// Initial constants
export const POPULAR_ROLES = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "AI Researcher",
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Product Manager",
  "Business Analyst",
  "UI/UX Designer",
  "Embedded Systems Engineer",
  "Mobile App Developer (iOS/Android)",
  "QA Automation Specialist",
  "Solutions Architect",
  "Database Administrator",
  "Systems Administrator",
  "Reliability Engineer (SRE)",
  "Hardware Engineer",
  "Scrum Master",
  "Tech Lead",
  "Director of Engineering",
  "VP of Technology",
  "Product Designer",
  "Data Visualization Expert",
  "Information Security Officer"
];

export const INTERVIEWERS: Interviewer[] = [
  {
    id: "ira",
    name: "Ira",
    title: "Global VP of Talent Acquisition (Leadership & HR)",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    avatarChar: "👩‍💼",
    description: "Professional HR personality with 12+ years of leadership hiring. Known for warm behavioral questioning, human-like voice matching, and empathetic feedback.",
    voiceName: "Female Neural Voice only",
    personality: "Supportive, attentive, behaviorally focused, professional HR",
    avatarColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "nick",
    name: "Nick",
    title: "Senior Engineering Architect (Systems & Core Coding)",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
    avatarChar: "👨‍💻",
    description: "Extremely sharp technical leader from Silicon Valley. Grills candidates on system scalability, code optimization, database locks, and deep scenario bottlenecks.",
    voiceName: "Male Neural Voice only",
    personality: "Analytical, technical, dynamic questioning, high-pressure architect",
    avatarColor: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    id: "john_maya",
    name: "John & Maya (Dual Panel)",
    title: "Senior VP of Engineering + Director of HR Operations",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    avatarChar: "👥",
    description: "A dual-interviewer panel simulating a real standard corporate loop. John asks system and tech architectural questions; Maya assesses stress tolerance, core behavioral STAR formulas, and cultural fit.",
    voiceName: "Dual Voices (John: Male Neural / Maya: Female Neural)",
    personality: "Collaborative, split style (Technical queries + Behavioral scenario checkpoints)",
    avatarColor: "bg-violet-50 text-violet-700 border-violet-200"
  }
];

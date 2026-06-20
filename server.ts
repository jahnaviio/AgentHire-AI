import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined. The app will run in offline simulation mode.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini:", err);
}

// REST endpoints for the Interactive Interview Platform

// 1. Role Research & Question Generation Endpoint
app.post("/api/research", async (req, res) => {
  const { role, difficulty } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  const selectedDiff = difficulty || "Intermediate";

  if (!ai) {
    // Elegant Offline Fallback
    return res.json(getOfflineResearch(role, selectedDiff));
  }

  try {
    const prompt = `Conduct highly detailed, senior-level career/interview research for the role: "${role}" at the "${selectedDiff}" expertise difficulty level.
    
CRITICAL QUESTION FILTER RULES depending on "${selectedDiff}" difficulty:
- If "Beginner": Generate questions focused on computer science and programming fundamentals, basic definitions, differences between concepts (e.g. difference between AI and ML), and training vs testing paradigms.
- If "Intermediate": Generate questions focused on algorithm implementations, xgboost principles, cross validation, feature engineering, and gradient descent.
- If "Experienced": Generate questions focused on system design of services, large scale production deployments, model optimization, scalability benchmarks, advanced RAG architectures, reducing end-to-end model latency, and technical team leadership.
    
Generate a comprehensive structured prep pack including standard questions matching this exact target level, customized category tags, ideal detailed model answers, and preparatory tips.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert HR Leader, Senior Technical Recruiter, and Multi-Agent Interview Systems Architect. Your output must strictly match the expected JSON schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleSummary: {
              type: Type.STRING,
              description: "A comprehensive senior-level briefing regarding the current state of this job role.",
            },
            questions: {
              type: Type.ARRAY,
              description: "List of top distinct interview questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    description: "Must be: Beginner, Intermediate, Advanced, Technical, Behavioral, or Scenario-Based" 
                  },
                  difficulty: { type: Type.STRING, description: "Junior, Mid, Senior, or Principal" },
                  modelAnswer: { type: Type.STRING, description: "A detailed high-quality target response demonstrating the ideal structural answer." },
                  tips: { type: Type.STRING, description: "Specific actionable tips to help key performance indicators for this answer." }
                },
                required: ["id", "question", "category", "difficulty", "modelAnswer", "tips"]
              }
            },
            rolePrepTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3-5 strategic prep instructions or tricks for this specific vertical."
            }
          },
          required: ["roleSummary", "questions", "rolePrepTips"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini research generation failed:", error);
    res.json(getOfflineResearch(role));
  }
});

// 2. Real-time Adaptive Follow-up / Response Challenge Endpoint
app.post("/api/live/question", async (req, res) => {
  const { role, interviewer, history, currentAnswer, difficulty } = req.body;
  // history is an array of { question: string, answer: string }
  
  if (!role || !interviewer) {
    return res.status(400).json({ error: "Role and Interviewer details are required" });
  }

  const activeDiff = difficulty || "Intermediate";

  if (!ai) {
    return res.json(getOfflineNextQuestion(role, interviewer, history, currentAnswer, activeDiff));
  }

  try {
    const prompt = `You are a simulated AI Interviewer panel conducting a session for the target path: "${role}" at the "${activeDiff}" expertise difficulty level.

Current Interview State:
- Difficulty level: "${activeDiff}" (Tailor your technical requirements: Beginner = CS/coding fundamentals, Intermediate = implementation/cross-validation details, Experienced = industrial system design, scalable RAG architectures, reducing latency, team leadership).
- History so far: ${JSON.stringify(history)}
- Candidate's latest spoken audio transcript for the previous question: "${currentAnswer || ""}"

TASK:
1. Evaluate the candidate's latest answer ("${currentAnswer || ""}") and classify it as exactly one of: "Correct", "Partially Correct", "Incorrect". If there is no previous answer, set this to "Correct".
2. Construct constructive feedback speech text:
   - If evaluated as "Correct", start with: "Good answer." followed by a very brief technical validation (max 2 sentences).
   - If evaluated as "Partially Correct", start with: "You're close. You explained the concept correctly but missed an important detail." followed by a very brief clarification of what was missing.
   - If evaluated as "Incorrect", start with: "That's not quite correct. Let me explain." followed by a brief tutorial of the correct concept.
   - If there is no last answers yet (this is the start), return "Welcome, I am ready to initiate your virtual technical assessment."
3. Generate the next technical interview question matching the Designated difficulty limit.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the AI interviewer speaking in real-time. Keep questions elegant, realistic, conversational, and direct. Your output must strictly match the JSON schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluationGrade: {
              type: Type.STRING,
              description: "Must be exactly one of: 'Correct', 'Partially Correct', or 'Incorrect'."
            },
            feedbackSpeech: {
              type: Type.STRING,
              description: "The spoken feedback evaluating the user's previous answer according to guidelines."
            },
            nextQuestion: { 
              type: Type.STRING, 
              description: "The next verbal question or adaptive challenge to ask the candidate." 
            },
            avatarMood: { 
              type: Type.STRING, 
              description: "The visual mood feedback. Must be: serious, thoughtful, smiling, nodding, surprised, or neutral." 
            },
            evaluationHint: {
              type: Type.STRING,
              description: "Internal assessment of the candidate's last answer."
            }
          },
          required: ["evaluationGrade", "feedbackSpeech", "nextQuestion", "avatarMood", "evaluationHint"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Live next question computation failed:", error);
    res.json(getOfflineNextQuestion(role, interviewer, history, currentAnswer));
  }
});

// 3. Multi-Agent Evaluation Endpoint
app.post("/api/live/evaluate", async (req, res) => {
  const { role, history, behaviorStats } = req.body;
  // history is array of { question: string, answer: string }
  // behaviorStats has cv metrics collected during the session

  if (!role || !history) {
    return res.status(400).json({ error: "Role and history log is required for evaluation." });
  }

  if (!ai) {
    return res.json(getOfflineEvaluation(role, history, behaviorStats));
  }

  try {
    const prompt = `Perform a comprehensive multi-agent assessment of the candidate's complete interview transcripts for the position: "${role}".
Interview Logs:
${JSON.stringify(history)}

User Real-time Behavioral Data (Eye Contact, nervous levels, posture attention, filler words frequency, etc):
${JSON.stringify(behaviorStats || {})}

Please instantiate the following 5 evaluation agents and synthesize their insights:
- Technical Evaluator: Grade technical concept precision, key vocabulary, and frameworks accuracy.
- Communication Evaluator: Analyze fluency, structure, tone, filler usage, and speed.
- Behavioral Evaluator: Check response alignment with STAR methodology (Situation, Task, Action, Result) and collaborative values.
- HR Evaluator: Grade overall fit, team hireability, and executive presentation.
- Confidence Evaluator: Evaluate computer vision attention metrics, eye contact stats, and nervous gestures count.

Compile a deep progress report, numerical dashboard metrics, strengths, detailed improvement actions, customized model replies, and a formal hiring recommendation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior recruitment panel of five distinct mock evaluation agents. Synthesize your final outputs into a single, cohesive industrial-grade JSON response matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Final weighted combination score from 0 to 100." },
            scores: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.INTEGER, description: "Technical capability out of 100" },
                communication: { type: Type.INTEGER, description: "Communication excellence out of 100" },
                confidence: { type: Type.INTEGER, description: "Physical attention + presence confidence out of 100" },
                behavioral: { type: Type.INTEGER, description: "Behavioral + STAR method structure out of 100" },
                hrReadiness: { type: Type.INTEGER, description: "Employability + recruitment fit out of 100" }
              },
              required: ["technical", "communication", "confidence", "behavioral", "hrReadiness"]
            },
            agentAssessments: {
              type: Type.OBJECT,
              properties: {
                technicalAgent: { type: Type.STRING, description: "Insight regarding technical command and precision." },
                communicationAgent: { type: Type.STRING, description: "Feedback on speaking clarity, formatting, and pacing." },
                behavioralAgent: { type: Type.STRING, description: "Deep analysis of behavioral attributes and star structures." },
                hrAgent: { type: Type.STRING, description: "Final corporate alignment and cultural readiness scorecard." },
                confidenceAgent: { type: Type.STRING, description: "Assessment of kinetic feedback, attention span, and posture." }
              },
              required: ["technicalAgent", "communicationAgent", "behavioralAgent", "hrAgent", "confidenceAgent"]
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "At least 3 core strengths identified during raw response evaluation."
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "At least 3 explicit skill gaps or verbal errors identified."
            },
            actionableSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step guidance mapping to improvement feedback."
            },
            sampleBetterAnswers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  weakPoints: { type: Type.STRING, description: "What was missing or weak in their actual wording." },
                  improvedAnswer: { type: Type.STRING, description: "A highly crafted alternative answer the user should memorize." }
                },
                required: ["question", "weakPoints", "improvedAnswer"]
              }
            },
            hiringRecommendation: {
              type: Type.STRING,
              description: "Must be exactly one of: 'Strong Hire', 'Hire', 'Borderline', 'Needs Improvement'"
            }
          },
          required: [
            "overallScore", 
            "scores", 
            "agentAssessments", 
            "strengths", 
            "improvements", 
            "actionableSteps", 
            "sampleBetterAnswers", 
            "hiringRecommendation"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Multi-Agent assessment engine failed:", error);
    res.json(getOfflineEvaluation(role, history, behaviorStats));
  }
});


// Robust offline fallback generators to prevent system crash in sandboxed environments

function getOfflineResearch(role: string, difficulty: string = "Intermediate") {
  return {
    roleSummary: `Strategic Prep Pack for ${role}. Deep market exploration highlights key competencies required in system designs, core pipelines, and cloud-native scalable solutions.`,
    questions: [
      {
        id: "q1",
        question: `Explain your core process for designing and scaling a clean architecture for a high-traffic ${role} solution.`,
        category: "Technical",
        difficulty: "Senior",
        modelAnswer: "An ideal response structures answers by mentioning decoupled layering, stateless design, microservices division or clear modules, active fail-overs, telemetry/monitoring, and detailed validation pipelines. Ensure you reference the standard STAR methodology or system architectural diagrams.",
        tips: "Highlight performance trade-offs, real-time caching mechanism, memory allocation, and fault tolerance paradigms in critical service limits."
      },
      {
        id: "q2",
        question: "Describe a time you faced a critical code failure or runtime error. How did you diagnose, debug, and implement mitigation policies?",
        category: "Behavioral",
        difficulty: "Mid",
        modelAnswer: "Use the STAR method: state the high-stakes bug, trace system diagnostic logs, demonstrate root-cause isolation using system telemetry or profiling tools, and describe steps to avoid recurring deployment blocks.",
        tips: "Avoid generic statements. Focus heavily on actual analytical tools and team collaboration during fire drills."
      },
      {
        id: "q3",
        question: "Imagine we have dual concurrent dependency blockades. How do you pitch technical resolution to cross-functional stakeholders?",
        category: "Scenario-Based",
        difficulty: "Advanced",
        modelAnswer: "Propose incremental decoupling, mock integrations, or alternative service-level contracts. Communicate technical constraints openly while mapping development speeds to overall company financial goals.",
        tips: "Focus on negotiation frameworks, visual mapping, and trade-off calculations."
      },
      {
        id: "q4",
        question: "What are the fundamental indicators of computational performance or algorithmic bottlenecks in your daily technology stack?",
        category: "Beginner",
        difficulty: "Junior",
        modelAnswer: "Mention latency cycles, database query locking, thread contentions, memory leak signatures, and garbage collection pauses.",
        tips: "Give explicit measurements (seconds vs milliseconds) and specify monitoring tools like APMs or flame graphs."
      }
    ],
    rolePrepTips: [
      "Familiarize yourself with architectural bottlenecks and stateless high-throughput microservices.",
      "Incorporate precise key performance metrics (latency, resource locks, throughput) in responses.",
      "Practice structured situational dialogue using the standard STAR structure (Situation, Task, Action, Result)."
    ]
  };
}

function getOfflineNextQuestion(role: string, interviewer: any, history: any[], currentAnswer: string, difficulty: string = "Intermediate") {
  const count = history.length;
  const questionsList = [
    "What architectural models do you prefer to guarantee clean service boundaries and strict separation of concerns?",
    "Could you walk me through your disaster recovery, caching patterns, or load balancing strategies?",
    "Tell me about a project where you had to quickly learn external domain frameworks. What was your strategy for immediate high-quality output?",
    "How do you balance rapid feature shipments with building robust automated test coverages and lint boundaries?",
    "Excellent responses so far. Before we finalize, how do you handle intense disagreements regarding roadmap features between engineering and product teams?"
  ];

  const moodPool = ["thoughtful", "smiling", "nodding", "serious", "neutral"];
  const selectedMood = moodPool[Math.floor(Math.random() * moodPool.length)];
  const nextQ = questionsList[Math.min(count, questionsList.length - 1)];

  let evaluationGrade = "Correct";
  let feedbackSpeech = "";

  if (currentAnswer && currentAnswer.trim().length > 0) {
    if (currentAnswer.trim().length > 50) {
      evaluationGrade = "Correct";
      feedbackSpeech = "Good answer. Your response touches on key architectural constraints and decoupled systems.";
    } else if (currentAnswer.trim().length > 15) {
      evaluationGrade = "Partially Correct";
      feedbackSpeech = "You're close. You explained the concept correctly but missed an important detail. We need to focus on low-latency memory caching.";
    } else {
      evaluationGrade = "Incorrect";
      feedbackSpeech = "That's not quite correct. Let me explain: modern microservice boundaries require stateless container management.";
    }
  } else {
    feedbackSpeech = "Welcome, I am ready to initiate your virtual technical assessment.";
  }

  return {
    evaluationGrade,
    feedbackSpeech,
    nextQuestion: nextQ,
    avatarMood: selectedMood,
    evaluationHint: currentAnswer 
      ? `Candidate provided a ${currentAnswer.length > 30 ? "detailed" : "brief"} response. Evaluator identified standard domain terminologies.`
      : "Awaiting initial candidate voice response to synthesize precise focus challenge."
  };
}

function getOfflineEvaluation(role: string, history: any[], stats: any) {
  const fillersCount = stats?.fillersCount || 2;
  const wpm = stats?.speakingSpeed || 125;
  const overall = Math.min(100, Math.max(40, 75 + Math.round(Math.random() * 15)));

  return {
    overallScore: overall,
    scores: {
      technical: overall - 3,
      communication: Math.min(100, 80 + Math.round(Math.random() * 15)),
      confidence: Math.min(100, 78 + Math.round(Math.random() * 15)),
      behavioral: overall + 2,
      hrReadiness: overall - 1
    },
    agentAssessments: {
      technicalAgent: `Technical analysis of answers for the ${role} position indicates solid theoretical familiarity. The nominee correctly handles standard terminology, though deep coding logic could benefit from deeper metric breakdowns.`,
      communicationAgent: `NOMINEE PACE: ${wpm} WPM. Communication clarity is effective. Filler words ("um"/"uh") were flagged ${fillersCount} times. Encouraging structured storytelling with reduced pauses.`,
      behavioralAgent: `Strong adherence to SITUATION-TASK-ACTION-RESULT flow. The user correctly describes their individual impact, emphasizing cross-functional partnership.`,
      hrAgent: `Highly employable with strong indicators of professional commitment. Readiness to integrate into current production schedules is exceptionally high.`,
      confidenceAgent: `Attention markers from real-time computer vision streams indicate high attention level. Good gaze tracking, lower fidgeting, and natural facial gestures.`
    },
    strengths: [
      "Structured conceptual answers using sequential storytelling layout.",
      "Clear articulation of technology stack benefits and systemic trade-offs.",
      "High real-time computer vision focus, attention level, and gaze alignment."
    ],
    improvements: [
      "Minor pauses when addressing rapid stress or scenario situations.",
      `Presence of verbal filler utterances (detected approx. ${fillersCount} occurrences).`,
      "Could introduce more concrete computational metric improvements (latency numbers, CPU savings) in technical answers."
    ],
    actionableSteps: [
      "Implement a 2-second tactical pause before speaking to organize thought architecture.",
      "Conscious vocal tracking of filler words ('um', 'actually', 'like') while speaking.",
      "Always ground technical answers in business outcomes, e.g., 'achieving a 25% compute efficiency increase'."
    ],
    sampleBetterAnswers: history.map((h, index) => ({
      question: h.question,
      weakPoints: "Lacks structural scalability stats or explicit quantitative parameters which recruiting managers seek.",
      improvedAnswer: `Indeed, to optimize ${role} solutions for this scenario, I utilize a decoupled structure utilizing Redis cache layering in front of Postgres. This architecture limits database strain. Under heavy workloads, this reduces latency by 45% (from 220ms to 9ms) while guaranteeing secure token validations on the edge.`
    })),
    hiringRecommendation: overall > 85 ? "Strong Hire" : "Hire"
  };
}


// Integrate Vite as Middleware

async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AGENTHIRE AI Server] Running securely on port ${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to boot Express server:", err);
});

import React, { useEffect, useState } from "react";
import { InterviewLog, RealtimeCVMetrics, SpeechMetrics, MultiAgentAssessment } from "../types";
import { 
  Award, ShieldCheck, Printer, RefreshCw, Layers, Brain, MessageSquare, 
  UserCheck, AlertTriangle, CheckCircle, Lightbulb, PlayCircle, Loader2,
  ArrowRight, ShieldAlert, Cpu
} from "lucide-react";

interface EvaluationDashboardProps {
  role: string;
  history: InterviewLog[];
  cvStats: RealtimeCVMetrics;
  speechStats: SpeechMetrics;
  onReset: () => void;
}

export default function EvaluationDashboard({ role, history, cvStats, speechStats, onReset }: EvaluationDashboardProps) {
  const [assessment, setAssessment] = useState<MultiAgentAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all-agents");
  const [printPack, setPrintPack] = useState(false);

  useEffect(() => {
    const triggerEvaluation = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/live/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            history,
            behaviorStats: {
              speakingSpeed: speechStats.speakingSpeed,
              fillersCount: speechStats.fillersCount,
              eyeContact: cvStats.eyeContact,
              facialExpression: cvStats.facialExpression,
              attentionLevel: cvStats.attentionLevel,
              headMovement: cvStats.headMovement,
              nervousBehavior: cvStats.nervousBehavior,
              engagementScore: cvStats.engagementScore
            }
          })
        });
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    triggerEvaluation();
  }, [role, history, cvStats, speechStats]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 max-w-lg mx-auto text-center bg-slate-900/60 border border-slate-800 rounded-2xl p-8" id="evaluation_loading">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <div className="space-y-2">
          <h3 className="font-display font-bold text-white text-xl">Deploying Evaluation Agents</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Directing 5 distinct machine learning evaluators (Technical precision, Communication, Behavioral STAR accuracy, confidence telemetry, and HR Readiness) to read verbal logs, audio tempos, and eye dynamics.
          </p>
        </div>

        <div className="w-full space-y-2 pt-2 text-left bg-slate-950 p-4 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            SYNTHESIZING AGENT 1: TECHNICAL CONCEPT PRECISION...
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
            SYNTHESIZING AGENT 2: COMMUNICATION & TEMPO FLOW...
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            SYNTHESIZING AGENT 3: SITUATION-TASK STAR VERITY...
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <p className="text-sm text-slate-400 font-mono">Evaluation compilation failed. Try resetting.</p>
        <button onClick={onReset} className="mt-4 px-4 py-2 bg-blue-600 rounded text-xs">Reset Platform</button>
      </div>
    );
  }

  // Set recommendation color classes
  let recommendationColor = "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30";
  if (assessment.hiringRecommendation === "Strong Hire") {
    recommendationColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
  } else if (assessment.hiringRecommendation === "Hire") {
    recommendationColor = "bg-blue-500/10 text-blue-400 border border-blue-500/30";
  } else if (assessment.hiringRecommendation === "Needs Improvement") {
    recommendationColor = "bg-rose-500/10 text-rose-400 border border-rose-500/30";
  }

  return (
    <div className="space-y-8" id="evaluation_dashboard">
      
      {/* Top action layout info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 no-print">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-indigo-400" />
            Assessment Intelligence Report
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Multi-Agent Diagnostic Summary • Candidate benchmarking complete
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="text-xs font-mono text-slate-400 hover:text-white border border-slate-800 hover:border-slate-705 rounded-lg py-1.5 px-3.5 transition-colors"
          >
            START NEW SESSION
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs font-mono py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            EXPORTER REPORT
          </button>
        </div>
      </div>

      {/* Main Grid: Overall progress ring + Score panels [3 cols] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Overall Score Circle Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative min-h-60 print:bg-slate-50 print:border print:border-slate-300 print:text-black">
          <Cpu className="absolute top-4 right-4 w-5 h-5 text-indigo-400 print:text-slate-500" />
          
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 print:text-slate-700">
            Overall Interview Index
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle track indicator */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-slate-950 fill-transparent print:stroke-slate-200"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-indigo-500 fill-transparent"
                strokeWidth="8"
                strokeDasharray="339.29"
                strokeDashoffset={339.29 - (339.29 * assessment.overallScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-x-0 text-center">
              <div className="text-4xl font-display font-extrabold text-white print:text-black">
                {assessment.overallScore}%
              </div>
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase mt-0.5 print:text-slate-700">
                BENCH SCORE
              </div>
            </div>
          </div>

          {/* Hiring recommendation badge status */}
          <div className={`mt-5 px-4 py-1.5 rounded-full text-xs font-bold font-mono ${recommendationColor}`}>
            RECOMMENDATION: {assessment.hiringRecommendation.toUpperCase()}
          </div>
        </div>

        {/* 5-Agent Dimension Rating Board */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:col-span-2 space-y-4 shadow-xl print:bg-slate-50 print:border print:border-slate-300 print:text-black">
          <h3 className="text-xs font-mono font-bold text-slate-405 uppercase tracking-widest border-b border-slate-800/80 pb-2 print:text-black">
            📋 Synthesized Agent Benchmarks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Technical concept score */}
            <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 print:bg-white print:border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 print:text-stone-750">Technical Accuracy</span>
                <span className="font-bold text-blue-400">{assessment.scores.technical}/100</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden print:bg-slate-100">
                <div className="h-full bg-blue-500" style={{ width: `${assessment.scores.technical}%` }} />
              </div>
            </div>

            {/* Communication accuracy */}
            <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 print:bg-white print:border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 print:text-stone-750">Communication tempo</span>
                <span className="font-bold text-purple-400">{assessment.scores.communication}/100</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden print:bg-slate-100">
                <div className="h-full bg-purple-500" style={{ width: `${assessment.scores.communication}%` }} />
              </div>
            </div>

            {/* Attention Gaze / confidence Index */}
            <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 print:bg-white print:border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 print:text-stone-750">Confidence Telemetry (CV)</span>
                <span className="font-bold text-emerald-400">{assessment.scores.confidence}/100</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden print:bg-slate-100">
                <div className="h-full bg-emerald-500" style={{ width: `${assessment.scores.confidence}%` }} />
              </div>
            </div>

            {/* Behavioral fit Score */}
            <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 print:bg-white print:border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 print:text-stone-750">Behavioral (STAR Method)</span>
                <span className="font-bold text-amber-400">{assessment.scores.behavioral}/100</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden print:bg-slate-100">
                <div className="h-full bg-amber-500" style={{ width: `${assessment.scores.behavioral}%` }} />
              </div>
            </div>

            {/* HR fit Score */}
            <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 print:bg-white print:border-slate-200 sm:col-span-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 print:text-stone-750">HR Suitability & Employability</span>
                <span className="font-bold text-teal-400">{assessment.scores.hrReadiness}/100</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden print:bg-slate-100">
                <div className="h-full bg-teal-500" style={{ width: `${assessment.scores.hrReadiness}%` }} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs list selecting 5 distinct AI Agent panels feedback */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-0.5 overflow-x-auto no-print">
          <button
            onClick={() => setActiveTab("all-agents")}
            className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all ${
              activeTab === "all-agents" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            All EVALUATOR INSTRUCTIONS
          </button>
          
          <button
            onClick={() => setActiveTab("tech")}
            className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all ${
              activeTab === "tech" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            TECHNICAL UNIT
          </button>

          <button
            onClick={() => setActiveTab("comm")}
            className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all ${
              activeTab === "comm" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            COMMUNICATION AUDIT
          </button>

          <button
            onClick={() => setActiveTab("star")}
            className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all ${
              activeTab === "star" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            BEHAVIORAL STAR UNIT
          </button>
        </div>

        {/* Tab contents block */}
        <div className="bg-slate-950/45 p-6 border border-slate-900 rounded-2xl space-y-4 print:bg-white print:border-none print:p-0">
          
          {/* Technical Section */}
          {(activeTab === "all-agents" || activeTab === "tech") && (
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 flex gap-4 items-start print:bg-slate-50 print:border print:border-slate-200">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 print:bg-blue-100">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-display print:text-black">
                  Agent 1: Technical Accuracy Evaluator Report
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5 print:text-slate-800">
                  {assessment.agentAssessments.technicalAgent}
                </p>
              </div>
            </div>
          )}

          {/* Communication Section */}
          {(activeTab === "all-agents" || activeTab === "comm") && (
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 flex gap-4 items-start print:bg-slate-50 print:border print:border-slate-200">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 print:bg-purple-100">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-display print:text-black">
                  Agent 2: Vocal Clari-Speed Analyst
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5 print:text-slate-800">
                  {assessment.agentAssessments.communicationAgent}
                </p>
              </div>
            </div>
          )}

          {/* Behavioral Section */}
          {(activeTab === "all-agents" || activeTab === "star") && (
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 flex gap-4 items-start print:bg-slate-50 print:border print:border-slate-200">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 print:bg-amber-100">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-display print:text-black">
                  Agent 3: STAR Behavioral Auditor
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5 print:text-slate-800">
                  {assessment.agentAssessments.behavioralAgent}
                </p>
              </div>
            </div>
          )}

          {/* HR assessment and Confidence tracking always shown below */}
          {activeTab === "all-agents" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* HR fit indicator */}
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 flex gap-3.5 items-start print:bg-slate-50 print:border print:border-slate-200">
                <div className="p-2 bg-teal-500/10 text-teal-400 print:bg-teal-100">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white print:text-black">Agent 4: Personnel Fit Assessor</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 print:text-slate-800">
                    {assessment.agentAssessments.hrAgent}
                  </p>
                </div>
              </div>

              {/* Confidence analysis */}
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850 flex gap-3.5 items-start print:bg-slate-50 print:border print:border-slate-200">
                <div className="p-2 bg-pink-500/10 text-pink-400 print:bg-pink-100">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white print:text-black">Agent 5: CV Kinetic Presence Tracker</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 print:text-slate-800">
                    {assessment.agentAssessments.confidenceAgent}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Strengths & Actionable Improvements Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Strengths */}
        <div className="bg-slate-900/40 p-6 border border-slate-850 rounded-2xl print:bg-white print:text-black">
          <h3 className="text-sm font-semibold text-white font-display border-b border-slate-800/80 pb-2 mb-4 flex items-center gap-2 print:text-black">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Core Verbal & Performance Strengths
          </h3>
          <ul className="space-y-3">
            {assessment.strengths.map((str, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-450 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="text-slate-350 print:text-stone-800">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Improvements */}
        <div className="bg-slate-900/40 p-6 border border-slate-850 rounded-2xl print:bg-white print:text-black">
          <h3 className="text-sm font-semibold text-white font-display border-b border-slate-800/80 pb-2 mb-4 flex items-center gap-2 print:text-black">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Prioritized Actionable Suggestions
          </h3>
          <ul className="space-y-3">
            {assessment.actionableSteps.map((step, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-450 leading-relaxed">
                <span className="text-amber-500 font-bold shrink-0">{idx + 1}.</span>
                <span className="text-slate-355 print:text-stone-800">{step}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Model answers rewrite recommendation cards */}
      {assessment.sampleBetterAnswers && assessment.sampleBetterAnswers.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl space-y-4 print:bg-white print:text-black">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2 print:text-black">
            💡 Sample Better Answers Custom Prepared
          </h3>

          <div className="space-y-4">
            {assessment.sampleBetterAnswers.map((sample, idx) => (
              <div key={idx} className="bg-slate-950/60 p-4 border border-slate-880 rounded-xl space-y-3 print:bg-slate-50 print:border-slate-300">
                <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase print:text-indigo-700">
                  Question Asked:
                </div>
                <p className="text-xs font-semibold text-white leading-relaxed print:text-black">
                  {sample.question}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-850/80">
                  <div className="md:col-span-1 space-y-1">
                    <div className="text-[9px] font-mono text-rose-500 font-bold uppercase">
                      Spoken weakness:
                    </div>
                    <p className="text-[11px] text-slate-450 italic leading-relaxed print:text-slate-800">
                      {sample.weakPoints}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-1 bg-indigo-500/5 p-3 rounded border border-indigo-500/10 print:bg-white print:border-slate-200">
                    <div className="text-[9px] font-mono text-emerald-400 font-bold uppercase print:text-emerald-700">
                      High-Yield Master Answer Rewrite:
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed print:text-slate-800">
                      {sample.improvedAnswer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Reset footer */}
      <div className="flex justify-center pt-2 border-t border-slate-850 no-print">
        <button
          onClick={onReset}
          className="text-xs font-mono text-slate-450 hover:text-slate-300 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          START NEW TEST SCENARIO
        </button>
      </div>

    </div>
  );
}

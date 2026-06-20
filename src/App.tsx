import React, { useState } from "react";
import RegistrationStep from "./components/RegistrationStep";
import ModeSelectionStep from "./components/ModeSelectionStep";
import InterviewerSelectionStep from "./components/InterviewerSelectionStep";
import LiveInterviewStep from "./components/LiveInterviewStep";
import EvaluationDashboard from "./components/EvaluationDashboard";
import { UserProfile, Interviewer, InterviewLog, RealtimeCVMetrics, SpeechMetrics } from "./types";
import { Cpu, Terminal, Users, UserCheck } from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState<
    "registration" | "mode_select" | "interviewer_select" | "live_interview" | "evaluation"
  >("registration");

  const [profile, setProfile] = useState<UserProfile>({ name: "", role: "" });
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  
  // History and final analytics stats saved for deep report
  const [history, setHistory] = useState<InterviewLog[]>([]);
  const [cvStats, setCvStats] = useState<RealtimeCVMetrics>({
    eyeContact: 90,
    facialExpression: "Engaged",
    attentionLevel: 92,
    headMovement: "Stable",
    postureScore: 90,
    smileFrequency: 1.2,
    nervousBehavior: 5,
    engagementScore: 94
  });
  const [speechStats, setSpeechStats] = useState<SpeechMetrics>({
    speakingSpeed: 125,
    voiceClarity: 95,
    fillersCount: 0,
    fluencyScore: 95,
    vocabularyUsage: "Diverse",
    confidenceScore: 94
  });

  const handleRegistrationComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setCurrentStep("mode_select");
  };

  const handleSelectLive = () => {
    setCurrentStep("interviewer_select");
  };

  const handleInterviewerSelected = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
    setCurrentStep("live_interview");
  };

  const handleInterviewComplete = (
    finalHistory: InterviewLog[],
    finalCv: RealtimeCVMetrics,
    finalSpeech: SpeechMetrics
  ) => {
    setHistory(finalHistory);
    setCvStats(finalCv);
    setSpeechStats(finalSpeech);
    setCurrentStep("evaluation");
  };

  const handleReset = () => {
    setProfile({ name: "", role: "" });
    setSelectedInterviewer(null);
    setHistory([]);
    setCurrentStep("registration");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-[#90EE90]/40 font-sans" id="app_root">
      {/* Upper Navigation Global Title */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#90EE90] border border-emerald-300 flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-display font-extrabold tracking-tight text-black leading-none text-base">
                AgentHire AI
              </h1>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 block font-bold">
                Professional Multi-Agent Assessment Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs font-mono text-slate-600 hidden sm:block">
              <span className="font-semibold text-slate-800">Candidate:</span> {profile.name || "Anonymous"} 
              {profile.role && <span className="ml-2 font-semibold text-slate-800">Role:</span>} {profile.role}
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-extrabold uppercase tracking-wide">
                SECURE CONTEXT LIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage wrapper */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentStep === "registration" && (
          <RegistrationStep onComplete={handleRegistrationComplete} initialProfile={profile} />
        )}

        {currentStep === "mode_select" && (
          <ModeSelectionStep 
            profile={profile} 
            onSelectLive={handleSelectLive} 
            onBack={() => setCurrentStep("registration")} 
          />
        )}

        {currentStep === "interviewer_select" && (
          <InterviewerSelectionStep 
            onSelect={handleInterviewerSelected} 
            onBack={() => setCurrentStep("mode_select")} 
          />
        )}

        {currentStep === "live_interview" && selectedInterviewer && (
          <LiveInterviewStep 
            profile={profile} 
            interviewer={selectedInterviewer} 
            onComplete={handleInterviewComplete} 
            onBack={() => setCurrentStep("mode_select")} 
          />
        )}

        {currentStep === "evaluation" && (
          <EvaluationDashboard 
            role={profile.role} 
            history={history} 
            cvStats={cvStats} 
            speechStats={speechStats} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Standardized professional platform credentials */}
      <footer className="border-t border-slate-200 py-6 md:py-8 bg-slate-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 AgentHire AI Platforms Inc. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-800 transition-colors">Computer Vision SDK v4.1</span>
            <span className="hover:text-slate-800 transition-colors">Gemini Realtime Engine</span>
            <span className="hover:text-slate-800 transition-colors">Terms of Evaluator Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

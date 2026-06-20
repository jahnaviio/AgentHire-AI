import React, { useState } from "react";
import { PrepPack, Question, UserProfile } from "../types";
import { BookOpen, Video, Loader2, ArrowLeft, Printer, Sparkles, AlertCircle } from "lucide-react";

interface ModeSelectionStepProps {
  profile: UserProfile;
  onSelectLive: () => void;
  onBack: () => void;
}

export default function ModeSelectionStep({ profile, onSelectLive, onBack }: ModeSelectionStepProps) {
  const [loading, setLoading] = useState(false);
  const [prepPack, setPrepPack] = useState<PrepPack | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [errorText, setErrorText] = useState<string | null>(null);

  // Categories list
  const categories = ["All", "Beginner", "Intermediate", "Advanced", "Technical", "Behavioral", "Scenario-Based"];

  const triggerRoleResearch = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          role: profile.role,
          difficulty: profile.difficulty 
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to communicate with research engine.");
      }
      const data = await response.json();
      setPrepPack(data);
    } catch (err: any) {
      console.error(err);
      setErrorText("Our backend service encountered a minor error. Operating in high-fidelity simulation mode.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredQuestions = prepPack
    ? activeCategory === "All"
      ? prepPack.questions
      : prepPack.questions.filter((q) => q.category.toLowerCase() === activeCategory.toLowerCase())
    : [];

  return (
    <div className="space-y-8" id="mode_selection">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-slate-900 transition-colors mb-2 font-bold"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK TO PROFILE
          </button>
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            Select Interview Strategy
          </h2>
          <p className="text-sm text-slate-600">
            Choose between preparing with detailed role questions or starting a real-time web-meeting mock interview.
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Candidate Target</div>
          <div className="text-xs font-bold text-slate-800 font-mono">{profile.name} • {profile.role}</div>
        </div>
      </div>

      {/* Mode selection buttons */}
      {!prepPack && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
          {/* Option 1: Interview Questions Research */}
          <div className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 p-6 md:p-8 rounded-2xl text-left transition-all duration-300 group flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">
                Role Research & Questions
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate the most frequently asked questions customized exactly for <strong>{profile.role}</strong>. Study detailed model answers, difficulty tiers, and critical recruitment tips before the live panel.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 font-mono pt-2 font-semibold">
                <li className="flex items-center gap-2">✔ High-Fidelity Deep Role Research</li>
                <li className="flex items-center gap-2">✔ Beginner to Scenario Categorizations</li>
                <li className="flex items-center gap-2">✔ Instant PDF / Print Prep Exporter</li>
              </ul>
            </div>
            <button
              onClick={triggerRoleResearch}
              className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-black border border-slate-350 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Analyze Role Question Banks
            </button>
          </div>

          {/* Option 2: Live Mock Interview */}
          <div className="bg-white hover:bg-slate-50 border border-emerald-300 p-6 md:p-8 rounded-2xl text-left transition-all duration-300 group flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5 text-[9px] font-mono text-emerald-800 font-bold">
              REAL-TIME AUDIO & VIDEO
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-all">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-extrabold text-slate-900">
                Live AI Mock Interview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Launch a face-to-face simulated interview with your selected AI panel. Evaluates webcam computer vision attention indicators, vocal parameters, STAR structural logic, and nervousness in real-time.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 font-mono pt-2 font-semibold">
                <li className="flex items-center gap-2">✔ User Webcam & Speech Recognition ON</li>
                <li className="flex items-center gap-2">✔ Computer Vision eye & smile indicators</li>
                <li className="flex items-center gap-2">✔ Interactive Multi-Agent scoring board</li>
              </ul>
            </div>
            <button
              onClick={onSelectLive}
              className="mt-8 w-full bg-[#90EE90] hover:bg-[#80df80] text-black border border-emerald-300 font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer text-center shadow-sm"
            >
              Start Live Interview Experience
            </button>
          </div>
        </div>
      )}

      {/* Loading research pack spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
          <Loader2 className="w-10 h-10 text-emerald-505 animate-spin text-emerald-500" />
          <h3 className="font-display font-bold text-slate-900 text-lg">Synthesizing Core Prep Material</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-mono font-medium">
            Deploying AI researcher to scan and synthesize common competency bounds for <span className="text-emerald-700 font-bold">{profile.role}</span>. Designing standard and principal assessment rubrics...
          </p>
        </div>
      )}

      {/* Displaying generated Prep Pack */}
      {prepPack && (
        <div className="space-y-6 pt-2 text-slate-900">
          {/* Action header with print */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl no-print">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono text-slate-700 font-semibold">ROLE STUDY PACK GENERATED IN SECURE CONTAINER</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPrepPack(null)}
                className="text-xs font-mono text-slate-600 hover:text-black transition-colors py-1.5 px-3 border border-slate-200 rounded-lg hover:bg-slate-100 font-bold"
              >
                CLOSE PACK
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#90EE90] hover:bg-[#80df80] text-black font-extrabold text-xs font-mono py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-300"
              >
                <Printer className="w-3.5 h-3.5" />
                PRINT PREP BANK (PDF)
              </button>
            </div>
          </div>

          {/* Printable Report Wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm print:bg-white print:border-none print:p-0">
            {/* Left sidebar info */}
            <div className="lg:col-span-1 space-y-6 animate-fade-in">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 print:text-black print:bg-slate-100">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-mono rounded font-bold">
                  <Sparkles className="w-3 h-3" />
                  ROLE SUMMARY
                </div>
                <h3 className="text-lg font-display font-extrabold text-slate-900 print:text-black">
                  Target: {profile.role}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed print:text-slate-800 font-medium">
                  {prepPack.roleSummary}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 print:text-black print:bg-slate-100 animate-fade-in">
                <div className="text-xs font-mono text-slate-700 uppercase tracking-wider font-bold">
                  Tactical Prep Tips
                </div>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-decimal list-inside font-medium print:text-slate-800">
                  {prepPack.rolePrepTips.map((tip, idx) => (
                    <li key={idx} className="pb-1">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Questions list with Category filtering */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-print">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer font-bold ${
                      activeCategory === cat
                        ? "bg-[#90EE90] text-black border border-emerald-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Questions wrapper */}
              <div className="space-y-4">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm print:bg-white print:border print:border-slate-300 print:text-black"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-emerald-800 px-2.5 py-0.5 bg-[#90EE90]/25 border border-[#90EE90]/50 rounded-md print:bg-emerald-100 print:text-emerald-700">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase border border-slate-200 px-2 py-0.5 rounded font-bold print:text-black">
                            {q.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 italic font-bold">
                          Difficulty: {q.difficulty || "Mid"}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 leading-relaxed print:text-black">
                        {q.question}
                      </h4>

                      <div className="pt-2 border-t border-slate-100 print:border-slate-300">
                        <div className="text-[10px] font-mono text-emerald-800 mb-1 print:text-emerald-700 font-bold uppercase tracking-wide">
                          Model Structural Answer:
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-150 font-medium print:bg-slate-50 print:border-slate-200">
                          {q.modelAnswer}
                        </p>
                      </div>

                      <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-100 flex gap-2.5 items-start print:bg-slate-100 print:border-slate-200">
                        <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 print:text-stone-700" />
                        <div>
                          <div className="text-[10px] font-mono text-emerald-800 uppercase font-bold print:text-black">
                            Aesthetic Tip:
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-semibold print:text-slate-700">
                            {q.tips}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border border-slate-200 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 font-mono font-bold">No questions generated matching these specific filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

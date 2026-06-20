import React from "react";
import { INTERVIEWERS, Interviewer } from "../types";
import { Star, ArrowLeft, Volume2, Users, UserCheck } from "lucide-react";

interface InterviewerSelectionStepProps {
  onSelect: (interviewer: Interviewer) => void;
  onBack: () => void;
}

export default function InterviewerSelectionStep({ onSelect, onBack }: InterviewerSelectionStepProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="interviewer_selection">
      <div className="text-center space-y-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 hover:text-black transition-colors mb-2 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          CHANGE STRATEGY
        </button>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
          Select Your AI Voice Assessor Option
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto font-sans">
          Choose between distinct invisible speech profiles configured with standard text-to-speech parameters and dynamic evaluation models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {INTERVIEWERS.map((interviewer) => {
          // Choose a beautiful helper icon
          const isPanel = interviewer.id === "panel" || interviewer.id === "john_maya";
          const isNick = interviewer.id === "nick";

          return (
            <div
              key={interviewer.id}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:shadow-md h-full"
            >
              <div className="space-y-4">
                {/* Clean Typographic Tag Frame instead of Photo */}
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 font-extrabold text-sm font-mono shadow-inner">
                    {isPanel ? <Users className="w-5 h-5 text-emerald-600" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-800 bg-[#90EE90]/20 border border-[#90EE90]/40 px-2.5 py-1 rounded-full font-bold">
                    <Star className="w-3 h-3 fill-emerald-800 text-emerald-800 animate-pulse" />
                    INLINE VOICE
                  </div>
                </div>

                {/* Character Name & Identity */}
                <div>
                  <h3 className="text-lg font-display font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {interviewer.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 block leading-tight mt-1 font-bold uppercase tracking-wider">
                    {interviewer.title}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-16 font-medium">
                  {interviewer.description}
                </p>

                {/* Protection bounds description */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    Vocal Gender Target:
                  </div>
                  <div className="text-xs text-slate-800 font-mono font-bold">
                    {isPanel ? "Alternating Male/Female Duo" : (isNick ? "Male Voice Only" : "Female Voice Only")}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    Assessor Persona:
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal font-semibold">
                    {interviewer.personality}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelect(interviewer)}
                className="mt-6 w-full bg-[#90EE90] hover:bg-[#80df80] text-black border border-emerald-300 font-extrabold py-3 rounded-xl text-xs transition-all cursor-pointer text-center font-mono shadow-sm active:scale-98"
              >
                Configure {interviewer.id === "john_maya" ? "Panel" : interviewer.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

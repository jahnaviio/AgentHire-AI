import React, { useState } from "react";
import { POPULAR_ROLES, UserProfile } from "../types";
import { User, Briefcase, Search, ArrowRight, ShieldCheck, Mail, Sparkles } from "lucide-react";

interface RegistrationStepProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

export default function RegistrationStep({ onComplete, initialProfile }: RegistrationStepProps) {
  const [name, setName] = useState(initialProfile.name || "");
  const [email, setEmail] = useState(initialProfile.email || "");
  const [selectedRole, setSelectedRole] = useState(initialProfile.role || "");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Experienced">(
    (initialProfile.difficulty as any) || "Intermediate"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredRoles = POPULAR_ROLES.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const finalRole = selectedRole || "AI Engineer";
    onComplete({ 
      name: name.trim(), 
      email: email.trim(),
      role: finalRole, 
      difficulty 
    });
  };

  return (
    <div className="max-w-2xl mx-auto" id="registration_step">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-mono mb-4 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          AGENTHIRE ASSESSMENT ENGINE
        </div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Create Candidate Profile
        </h2>
        <p className="text-sm text-slate-600">
          Enter your professional information to tailor technical benchmarking, behavioral templates, and real-time posture indicators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
        {/* Core Profile Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                id="full_name_input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jahanvi Duggapu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm transition-all font-sans font-medium"
              />
            </div>
          </div>

          {/* Email Field (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Email Address <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="email_input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jahnavi@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm transition-all font-sans font-medium"
              />
            </div>
          </div>
        </div>

        {/* Selected Role Field */}
        <div className="space-y-2 relative">
          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-bold">
            Target Job Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              onClick={() => {
                setShowDropdown(!showDropdown);
                setSearchTerm("");
              }}
              value={selectedRole || "Select role (e.g. AI Engineer)"}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm cursor-pointer transition-all font-sans font-medium hover:bg-slate-100"
            />
          </div>

          {/* Search Dropdown Panel */}
          {showDropdown && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-250 rounded-xl p-3 shadow-xl space-y-3 max-h-72 overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search popular technical/engineering roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all font-mono"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((roleOpt) => (
                    <button
                      key={roleOpt}
                      type="button"
                      onClick={() => {
                        setSelectedRole(roleOpt);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors block ${
                        selectedRole === roleOpt
                          ? "bg-[#90EE90]/25 text-emerald-950 font-bold border border-emerald-300"
                          : "text-slate-650 hover:bg-slate-150 hover:text-black"
                      }`}
                    >
                      {roleOpt}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-2 text-xs text-slate-500">
                    No matching roles. Type to create a niche title.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Choose Difficulty Level */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-bold">
            Select Interview Difficulty
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Beginner Card */}
            <button
              type="button"
              onClick={() => setDifficulty("Beginner")}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                difficulty === "Beginner"
                  ? "bg-[#90EE90]/15 border-emerald-400 ring-2 ring-emerald-300/30"
                  : "bg-white border-slate-200 hover:border-slate-350"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900">Beginner</span>
                {difficulty === "Beginner" && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </div>
              <p className="text-[10.5px] text-slate-500 font-sans leading-tight mt-1.5">
                Focuses primarily on computer science & programming fundamentals, core AI/ML definitions, supervised and unsupervised paradigms.
              </p>
            </button>

            {/* Intermediate Card */}
            <button
              type="button"
              onClick={() => setDifficulty("Intermediate")}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                difficulty === "Intermediate"
                  ? "bg-[#90EE90]/15 border-emerald-400 ring-2 ring-emerald-300/30"
                  : "bg-white border-slate-200 hover:border-slate-350"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900">Intermediate</span>
                {difficulty === "Intermediate" && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </div>
              <p className="text-[10.5px] text-slate-500 font-sans leading-tight mt-1.5">
                Focuses on real algorithms and design implementation: Random Forest structure, Gradient Descent tuning, XGBoost math, and Feature Engineering.
              </p>
            </button>

            {/* Experienced Card */}
            <button
              type="button"
              onClick={() => setDifficulty("Experienced")}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                difficulty === "Experienced"
                  ? "bg-[#90EE90]/15 border-emerald-400 ring-2 ring-emerald-300/30"
                  : "bg-white border-slate-200 hover:border-slate-350"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900">Experienced</span>
                {difficulty === "Experienced" && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </div>
              <p className="text-[10.5px] text-slate-500 font-sans leading-tight mt-1.5">
                Focuses on industrial System Design, deep LLM production deployment pipelines, RAG architectural scalability, and latency reduction modeling.
              </p>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          id="registration_next_btn"
          disabled={!name.trim() || !selectedRole}
          className="w-full bg-[#90EE90] hover:bg-[#80df80] text-black font-extrabold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 border border-emerald-300/40 disabled:opacity-50"
        >
          Initialize Platform Assessment
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        {/* Telemetry info footer */}
        <div className="pt-4 border-t border-slate-150 rounded-b-2xl grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500 font-extrabold">
          <div>
            <div className="text-slate-800 font-sans font-bold">SPEECH TRANSCRIPT</div>
            <div>Web Speech Pipeline</div>
          </div>
          <div>
            <div className="text-slate-800 font-sans font-bold">COMPUTER VISION</div>
            <div>Face-Pose Telemetry</div>
          </div>
          <div>
            <div className="text-slate-800 font-sans font-bold">ASSESSOR AGENTS</div>
            <div>5-Agent Panel Server</div>
          </div>
        </div>
      </form>
    </div>
  );
}

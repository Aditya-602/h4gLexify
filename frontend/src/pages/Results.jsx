import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowLeft,
  IconAlertTriangle,
  IconSwords,
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconScale,
  IconFlag,
  IconShieldCheck,
  IconMail,
  IconFileDescription,
  IconUsers,
  IconClock,
  IconWorld,
  IconMessageQuestion,
  IconGavel,
  IconZoomCode,
} from "@tabler/icons-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const riskMeta = (level) => {
  const normalized = (level || "").toLowerCase();
  if (normalized === "high") {
    return {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
      label: "High",
    };
  }
  if (normalized === "medium") {
    return {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-400",
      label: "Med",
    };
  }
  if (normalized === "low") {
    return {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      label: "Low",
    };
  }
  return {
    color: "text-neutral-400",
    bg: "bg-neutral-50",
    border: "border-neutral-100",
    dot: "bg-neutral-300",
    label: "None",
  };
};

const firstSentence = (value) => {
  const text = String(value || "").trim();
  if (!text) return "No details available.";
  const match = text.match(/^(.+?[.!?])(?:\s|$)/);
  return match ? match[1].trim() : text;
};

const briefText = (value, wordLimit = 16) => {
  const sentence = firstSentence(value);
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length <= wordLimit) return sentence;
  return `${words.slice(0, wordLimit).join(" ")}...`;
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!result) return <Navigate to="/demo" />;

  const riskOrder = { high: 0, medium: 1, low: 2, none: 3 };
  const sortedClauses = [...(result.clauses || [])].sort(
    (a, b) =>
      (riskOrder[(a.risk_level || "none").toLowerCase()] ?? 3) -
      (riskOrder[(b.risk_level || "none").toLowerCase()] ?? 3),
  );

  const active = selectedIdx !== null ? sortedClauses[selectedIdx] : null;
  const hovered = hoveredIdx !== null ? sortedClauses[hoveredIdx] : null;
  const activeMeta = active ? riskMeta(active.risk_level) : riskMeta("none");
  const isHigh = active && (active.risk_level || "").toLowerCase() === "high";

  const highCount = sortedClauses.filter(
    (clause) => (clause.risk_level || "").toLowerCase() === "high",
  ).length;
  const medCount = sortedClauses.filter(
    (clause) => (clause.risk_level || "").toLowerCase() === "medium",
  ).length;
  const lowCount = sortedClauses.filter(
    (clause) => (clause.risk_level || "").toLowerCase() === "low",
  ).length;
  const contradictionCount = result.contradictions?.length || 0;
  const totalClauses = sortedClauses.length;

  const scoreColor =
    result.verdict === "red"
      ? "text-red-600"
      : result.verdict === "yellow"
        ? "text-amber-500"
        : "text-emerald-600";
  const scoreBg =
    result.verdict === "red"
      ? "bg-red-50 border-red-200"
      : result.verdict === "yellow"
        ? "bg-amber-50 border-amber-200"
        : "bg-emerald-50 border-emerald-200";
  const verdictLabel =
    result.verdict === "red"
      ? "Do not sign"
      : result.verdict === "yellow"
        ? "Review first"
        : "Looks safe";
  const overviewLine = `Score ${result.risk_score}/100. ${highCount} high-risk, ${medCount} medium-risk, ${lowCount} low-risk clauses, and ${contradictionCount} contradictions.`;
  const quickPreview = hovered && !active;

  return (
    <div className="h-screen bg-linear-to-br from-white via-neutral-50 to-white px-4 pt-24 pb-3 font-mono overflow-hidden">
      <div className="mx-auto flex h-[calc(100%-0.75rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-neutral-200 bg-white text-gray-800 shadow-2xl">
        <div className="w-[36%] min-w-85 border-r border-gray-200 flex flex-col overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`p-5 border-b border-gray-200 shrink-0 ${scoreBg}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <IconShieldCheck size={13} className={scoreColor} />
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Overall risk score
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <motion.span
                className={`text-7xl font-black tracking-tighter ${scoreColor}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                  delay: 0.15,
                }}
              >
                {result.risk_score}
              </motion.span>
              <span className="text-xl text-neutral-300 font-bold">/100</span>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${scoreBg} ${scoreColor}`}
            >
              <IconGavel size={12} />
              {verdictLabel}
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/5"
            >
              {[
                {
                  label: "Clauses",
                  value: totalClauses,
                  color: "text-neutral-900",
                  bg: "bg-neutral-50",
                },
                {
                  label: "High",
                  value: highCount,
                  color: "text-red-600",
                  bg: "bg-red-50",
                },
                {
                  label: "Medium",
                  value: medCount,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  label: "Low",
                  value: lowCount,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Contradictions",
                  value: contradictionCount,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Aggression",
                  value: `${result.aggressiveness_score}/10`,
                  color: "text-primary",
                  bg: "bg-primary/5",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className={`rounded-xl px-3 py-2 ${stat.bg}`}
                >
                  <div
                    className={`text-lg font-black leading-none ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-wide text-neutral-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
            <button
              type="button"
              onClick={() => {
                setSelectedIdx(null);
                setHoveredIdx(null);
                setShowOriginal(false);
              }}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-all flex items-center gap-3 ${selectedIdx === null ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-gray-50"}`}
            >
              <IconScale
                size={14}
                className={
                  selectedIdx === null ? "text-primary" : "text-neutral-400"
                }
              />
              <span
                className={`text-xs font-bold ${selectedIdx === null ? "text-primary" : "text-neutral-600"}`}
              >
                Overview
              </span>
            </button>

            {result.contradictions?.length > 0 && (
              <div className="px-4 pt-3 pb-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2 flex items-center gap-1.5">
                  <IconSwords size={10} /> Contradictions
                </div>
                {result.contradictions.map((contradiction, index) => (
                  <div
                    key={index}
                    className="mb-2 rounded-xl bg-purple-50 border border-purple-200 p-3"
                  >
                    <div className="flex gap-1.5 items-center mb-1">
                      <span className="text-[10px] font-black bg-white text-purple-600 px-1.5 py-0.5 rounded-md border border-purple-200">
                        #{contradiction.clause_a}
                      </span>
                      <span className="text-[9px] text-purple-400">vs</span>
                      <span className="text-[10px] font-black bg-white text-purple-600 px-1.5 py-0.5 rounded-md border border-purple-200">
                        #{contradiction.clause_b}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-700 leading-relaxed line-clamp-2">
                      {briefText(contradiction.explanation, 18)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="px-3 pt-2 pb-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 px-1 flex items-center gap-1.5">
                <IconFlag size={10} /> Clauses sorted by risk
              </div>
              <motion.div variants={stagger} initial="hidden" animate="show">
                {sortedClauses.map((clause, index) => {
                  const meta = riskMeta(clause.risk_level);
                  const isActive = index === selectedIdx;
                  const isHovered = index === hoveredIdx;

                  return (
                    <motion.button
                      key={clause.id}
                      type="button"
                      variants={fadeUp}
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() =>
                        setHoveredIdx((current) =>
                          current === index ? null : current,
                        )
                      }
                      onFocus={() => setHoveredIdx(index)}
                      onBlur={() =>
                        setHoveredIdx((current) =>
                          current === index ? null : current,
                        )
                      }
                      onClick={() => {
                        setSelectedIdx(index);
                        setHoveredIdx(null);
                        setShowOriginal(false);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left mb-1.5 rounded-xl px-3 py-3 transition-all border ${
                        isActive
                          ? "bg-white shadow-md border-gray-300"
                          : isHovered
                            ? "bg-white border-gray-200 shadow-sm"
                            : "border-transparent hover:bg-white hover:border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <motion.div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dot}`}
                          animate={isActive ? { scale: [1, 1.4, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider ${meta.color}`}
                        >
                          {meta.label} risk
                        </span>
                        <span className="text-[10px] text-neutral-300 ml-auto font-mono">
                          #{clause.id}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-snug line-clamp-2 ${isActive ? "text-neutral-900 font-semibold" : "text-neutral-600"}`}
                      >
                        {briefText(clause.plain_english, 14)}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-neutral-400 uppercase tracking-wide">
                        <span>{clause.category}</span>
                        <span>Click for report</span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/demo")}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-800 transition-colors"
              >
                <IconArrowLeft size={14} /> Back
              </button>
              <div className="h-4 w-px bg-neutral-200" />
              <span className="text-sm font-bold text-neutral-900">
                {result.document_type}
              </span>
              {result.key_facts?.jurisdiction && (
                <>
                  <div className="h-4 w-px bg-neutral-200" />
                  <span className="text-xs text-neutral-400">
                    {result.key_facts.jurisdiction}
                  </span>
                </>
              )}
            </div>
            {result.aggressiveness_score != null && (
              <div className="flex items-center gap-2 min-w-45">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider shrink-0">
                  Aggression
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(result.aggressiveness_score / 10) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
                <span className="text-[10px] font-black text-primary shrink-0">
                  {result.aggressiveness_score}/10
                </span>
              </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
            {selectedIdx === null && (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-5 max-w-3xl mx-auto"
              >
                {quickPreview && (
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <IconEye size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Quick peek
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                          Plain English
                        </div>
                        <p className="text-sm text-neutral-800 leading-relaxed">
                          {briefText(hovered.plain_english, 18)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                          Why it matters
                        </div>
                        <p className="text-sm text-neutral-800 leading-relaxed">
                          {briefText(
                            hovered.reason || "No extra reason was provided.",
                            18,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
                      <span
                        className={`px-2.5 py-1 rounded-full border ${riskMeta(hovered.risk_level).bg} ${riskMeta(hovered.risk_level).border} ${riskMeta(hovered.risk_level).color}`}
                      >
                        {riskMeta(hovered.risk_level).label} risk
                      </span>
                      <span className="px-2.5 py-1 rounded-full border border-neutral-200 bg-white text-neutral-500">
                        {hovered.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full border border-neutral-200 bg-white text-neutral-500">
                        Clause #{hovered.id}
                      </span>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  variants={fadeUp}
                  className={`rounded-2xl border p-5 ${scoreBg}`}
                >
                  <div className={`flex items-center gap-2 mb-2 ${scoreColor}`}>
                    <IconGavel size={16} />
                    <span className="text-sm font-black uppercase tracking-wider">
                      {verdictLabel}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                    {overviewLine}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                    Hover any clause for a quick preview. Click it to open the
                    full report.
                  </p>
                </motion.div>

                {result.key_facts && (
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-1.5">
                      <IconFileDescription size={11} /> Key facts
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Parties",
                          val: result.key_facts.parties,
                          icon: (
                            <IconUsers size={13} className="text-neutral-400" />
                          ),
                        },
                        {
                          label: "Duration",
                          val: result.key_facts.duration,
                          icon: (
                            <IconClock size={13} className="text-neutral-400" />
                          ),
                        },
                        {
                          label: "Jurisdiction",
                          val: result.key_facts.jurisdiction,
                          icon: (
                            <IconWorld size={13} className="text-neutral-400" />
                          ),
                        },
                      ].map((fact) => (
                        <div
                          key={fact.label}
                          className="bg-neutral-50 rounded-xl p-3 border border-neutral-100"
                        >
                          <div className="flex items-center gap-1 mb-1.5">
                            {fact.icon}
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                              {fact.label}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-neutral-800 leading-snug">
                            {fact.val || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result.top_concerns?.length > 0 && (
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-1.5">
                      <IconAlertTriangle size={12} /> Top concerns
                    </div>
                    <div className="space-y-2">
                      {result.top_concerns.map((concern, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="flex gap-3 items-start bg-red-50 border border-red-100 p-3 rounded-xl leading-snug"
                        >
                          <span className="text-red-500 font-black text-sm shrink-0">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-semibold text-neutral-800">
                            {briefText(concern, 16)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result.suggested_questions?.length > 0 && (
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                      <IconMessageQuestion size={12} /> Questions to ask
                    </div>
                    <div className="space-y-2">
                      {result.suggested_questions.map((question, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-start bg-neutral-50 border border-neutral-200 p-3 rounded-xl leading-snug"
                        >
                          <span className="text-primary font-black text-sm shrink-0">
                            Q{index + 1}.
                          </span>
                          <span className="text-sm text-neutral-700 font-medium">
                            {briefText(question, 16)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {selectedIdx !== null && active && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-3xl mx-auto space-y-4"
                >
                  <div
                    className={`rounded-2xl border-2 p-6 ${activeMeta.bg} ${activeMeta.border}`}
                  >
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border shadow-sm ${activeMeta.bg} ${activeMeta.color} ${activeMeta.border}`}
                      >
                        {active.risk_level} risk
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                        {active.category}
                      </span>
                      <span className="ml-auto text-xs text-neutral-400 font-mono">
                        Clause #{active.id}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 leading-snug">
                      {active.plain_english}
                    </h2>
                  </div>

                  {active.reason && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <IconAlertTriangle
                          size={13}
                          className={activeMeta.color}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Why it matters
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {active.reason}
                      </p>
                    </div>
                  )}

                  {isHigh && active.deep_dive && (
                    <div className="rounded-2xl border border-primary/20 bg-white p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <IconZoomCode size={13} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          Deeper view
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {active.deep_dive}
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <button
                      type="button"
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors w-full"
                    >
                      {showOriginal ? (
                        <IconChevronUp size={13} />
                      ) : (
                        <IconChevronDown size={13} />
                      )}
                      {showOriginal
                        ? "Hide original text"
                        : "Show original text"}
                    </button>
                    <AnimatePresence>
                      {showOriginal && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 bg-neutral-900 rounded-xl p-4 text-xs font-mono text-neutral-300 leading-relaxed whitespace-pre-wrap">
                            {active.original}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {result.email_draft && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                        <IconMail size={12} /> Pushback email draft
                      </div>
                      <div className="bg-neutral-900 rounded-xl p-4 text-xs font-mono text-green-400 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-neutral-600">
                        {result.email_draft}
                      </div>
                    </div>
                  )}

                  {result.suggested_questions?.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                        <IconMessageQuestion size={12} /> Questions to ask
                      </div>
                      <div className="space-y-2">
                        {result.suggested_questions.map((question, index) => (
                          <div
                            key={index}
                            className="flex gap-3 items-start bg-neutral-50 border border-neutral-200 p-3 rounded-xl leading-snug"
                          >
                            <span className="text-primary font-black text-sm shrink-0">
                              Q{index + 1}.
                            </span>
                            <span className="text-sm text-neutral-700 font-medium">
                              {question}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={selectedIdx === 0}
                      onClick={() => {
                        setSelectedIdx((current) => current - 1);
                        setShowOriginal(false);
                      }}
                      className="flex-1 py-2 text-xs font-bold border border-gray-200 rounded-xl text-neutral-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      disabled={selectedIdx === sortedClauses.length - 1}
                      onClick={() => {
                        setSelectedIdx((current) => current + 1);
                        setShowOriginal(false);
                      }}
                      className="flex-1 py-2 text-xs font-bold border border-gray-200 rounded-xl text-neutral-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Next →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIdx(null);
                        setHoveredIdx(null);
                        setShowOriginal(false);
                      }}
                      className="flex-1 py-2 text-xs font-bold border border-primary/20 rounded-xl text-primary hover:bg-primary/5 transition-all"
                    >
                      Overview
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

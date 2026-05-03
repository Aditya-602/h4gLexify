import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "../components/FileUpload";
import {
  IconUpload,
  IconLink,
  IconTextCaption,
  IconHistory,
  IconTrash,
  IconRobot,
  IconChevronRight,
} from "@tabler/icons-react";

export default function Demo() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState("");
  const [rawText, setRawText] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState([]);
  const terminalEndRef = useRef(null);

  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("legal_analyzer_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (result) => {
    const entry = {
      id: result.session_id || Date.now().toString(),
      date:
        new Date().toLocaleDateString() +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      type: result.document_type || "Document",
      risk: result.risk_score || 0,
      verdict: result.verdict || "green",
      data: result,
    };

    setHistory((prev) => {
      const newHistory = [
        entry,
        ...prev.filter((h) => h.id !== entry.id),
      ].slice(0, 10); // Keep last 10
      localStorage.setItem(
        "legal_analyzer_history",
        JSON.stringify(newHistory),
      );
      return newHistory;
    });
  };

  const handleFileUpload = (newFiles) => {
    setFiles(newFiles);
  };

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setLogs(["[SYSTEM] Initializing agentic analysis pipeline..."]);

    try {
      let body;
      let headers = {};

      if (files.length > 0) {
        body = new FormData();
        body.append("file", files[0]);
      } else if (url) {
        body = JSON.stringify({ url });
        headers["Content-Type"] = "application/json";
      } else if (rawText) {
        body = JSON.stringify({ text: rawText });
        headers["Content-Type"] = "application/json";
      } else {
        setIsAnalyzing(false);
        return;
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) throw new Error("Failed to start analysis");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let finalResult = null;
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop(); // keep incomplete chunk

        for (const part of parts) {
          const lines = part.split("\n");
          let eventType = "message";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event:")) eventType = line.substring(6).trim();
            else if (line.startsWith("data:")) data = line.substring(5).trim();
          }

          if (eventType === "progress") {
            setLogs((prev) => [...prev, data]);
          } else if (eventType === "result") {
            finalResult = JSON.parse(data);
          } else if (eventType === "error") {
            console.error("Error from backend:", data);
            setLogs((prev) => [...prev, `[ERROR] ${data}`]);
            setTimeout(() => {
              alert("Analysis failed: " + data);
              setIsAnalyzing(false);
            }, 1000);
            return;
          }
        }
      }

      if (finalResult) {
        saveToHistory(finalResult);
        setLogs((prev) => [
          ...prev,
          "[SYSTEM] Analysis complete. Redirecting to dashboard...",
        ]);
        setTimeout(() => {
          navigate("/results", { state: { result: finalResult } });
        }, 800);
      } else {
        setIsAnalyzing(false);
        alert("Analysis completed but no result was returned.");
      }
    } catch (e) {
      console.error(e);
      setLogs((prev) => [
        ...prev,
        "[ERROR] Failed to connect to backend. Is it running?",
      ]);
      setTimeout(() => {
        alert("Failed to connect to backend.");
        setIsAnalyzing(false);
      }, 1000);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("legal_analyzer_history");
    setHistory([]);
  };

  return (
    <div className="relative z-10 w-full min-h-screen px-4 md:px-8 py-32 flex flex-col items-center pointer-events-auto overflow-hidden">
      {/* Loading Overlay - Terminal Style */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md p-4 transition-opacity duration-300">
          <div className="w-full max-w-3xl bg-[#0d0d0d] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-800 overflow-hidden animate-fadeInScale flex flex-col">
            {/* Terminal Header */}
            <div className="bg-[#1a1a1a] px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-neutral-500 font-mono text-xs font-bold tracking-widest">
                AGENTIC_PIPELINE.sh
              </span>
              <div className="w-12"></div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 h-[400px] overflow-y-auto font-mono text-sm flex flex-col scroll-smooth">
              <div className="space-y-3">
                {logs.map((log, i) => {
                  const isError =
                    log.toLowerCase().includes("error") ||
                    log.toLowerCase().includes("failed");
                  const isWarning =
                    log.includes("⚠") || log.toLowerCase().includes("warning");
                  const isSystem = log.includes("[SYSTEM]");
                  const textColor = isError
                    ? "text-red-400"
                    : isWarning
                      ? "text-yellow-400"
                      : isSystem
                        ? "text-blue-400"
                        : "text-green-400";

                  return (
                    <div key={i} className="flex gap-4">
                      <span className="text-neutral-600 select-none shrink-0 opacity-70">
                        [{new Date().toISOString().split("T")[1].slice(0, 8)}]
                      </span>
                      <span
                        className={`${textColor} leading-relaxed break-words tracking-tight`}
                      >
                        {log}
                      </span>
                    </div>
                  );
                })}

                <div className="flex gap-4 mt-2">
                  <span className="text-neutral-600 select-none opacity-0 shrink-0">
                    [00:00:00]
                  </span>
                  <span className="w-2.5 h-5 bg-neutral-400 animate-pulse mt-0.5"></span>
                </div>

                <div ref={terminalEndRef} className="h-1 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 drop-shadow-sm animate-fadeInScale">
          Try the <span className="text-primary">Demo</span>
        </h1>
        <p
          className="text-lg text-neutral-600 max-w-xl mx-auto drop-shadow-sm opacity-0 animate-fadeInUp"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          Provide your legal document to see the agentic pipeline in action.
        </p>
      </div>

      {/* Main Layout Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col xl:flex-row gap-6 relative z-50">
        {/* Main Card (Left side) */}
        <div
          className="flex-grow bg-white border border-neutral-200 shadow-2xl rounded-3xl p-8 md:p-10 opacity-0 animate-fadeInUp"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Upload Component */}
            <div
              className="flex-1 flex flex-col justify-center opacity-0 animate-fadeInUp"
              style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
            >
              <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <IconUpload size={20} className="text-primary" />
                Upload Document
              </h2>
              <div className="transform transition-all hover:scale-[1.01] duration-300">
                <FileUpload onChange={handleFileUpload} />
              </div>
              {files.length > 0 && (
                <button
                  onClick={handleAnalyze}
                  className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 animate-fadeInScale flex items-center justify-center gap-2"
                >
                  <IconRobot size={20} />
                  Analyze File
                </button>
              )}
            </div>

            {/* Divider */}
            <div
              className="hidden lg:flex items-center justify-center opacity-0 animate-fadeInUp"
              style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
            >
              <div className="h-full w-[1px] bg-neutral-200 relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-bold text-neutral-400">
                  OR
                </div>
              </div>
            </div>
            <div
              className="flex lg:hidden items-center justify-center w-full relative py-4 opacity-0 animate-fadeInUp"
              style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
            >
              <div className="w-full h-[1px] bg-neutral-200"></div>
              <div className="absolute left-1/2 -translate-x-1/2 bg-white px-4 text-xs font-bold text-neutral-400">
                OR
              </div>
            </div>

            {/* Right: URL & Paste Text */}
            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div
                className="opacity-0 animate-fadeInUp group"
                style={{
                  animationDelay: "1000ms",
                  animationFillMode: "forwards",
                }}
              >
                <label className="text-sm font-bold text-neutral-700 mb-2 group-focus-within:text-primary transition-colors flex items-center gap-2">
                  <IconLink size={16} />
                  Analyze from URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-mono text-sm shadow-sm hover:border-neutral-400"
                />
              </div>

              <div
                className="flex items-center gap-4 opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: "1100ms",
                  animationFillMode: "forwards",
                }}
              >
                <div className="h-[1px] flex-1 bg-neutral-200"></div>
                <span className="text-neutral-400 text-xs font-bold">OR</span>
                <div className="h-[1px] flex-1 bg-neutral-200"></div>
              </div>

              <div
                className="opacity-0 animate-fadeInUp group"
                style={{
                  animationDelay: "1200ms",
                  animationFillMode: "forwards",
                }}
              >
                <label className="text-sm font-bold text-neutral-700 mb-2 group-focus-within:text-primary transition-colors flex items-center gap-2">
                  <IconTextCaption size={16} />
                  Paste raw text
                </label>
                <textarea
                  rows="5"
                  placeholder="Paste contract text here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none font-mono text-sm shadow-sm hover:border-neutral-400"
                ></textarea>
              </div>

              <div
                className="opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: "1300ms",
                  animationFillMode: "forwards",
                }}
              >
                <button
                  onClick={handleAnalyze}
                  disabled={!url && !rawText}
                  className={`w-full py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    url || rawText
                      ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1"
                      : "bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  <IconRobot size={20} />
                  Analyze Input
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Sidebar (Right side) */}
        <div
          className="w-full xl:w-80 bg-white border border-neutral-200 shadow-2xl rounded-3xl p-6 flex flex-col opacity-0 animate-fadeInUp"
          style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <IconHistory size={20} className="text-neutral-500" />
              History
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <IconTrash size={14} />
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm text-center py-10">
                <span>No recent analyses.</span>
                <span className="text-xs mt-1">
                  Files you analyze will appear here.
                </span>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    navigate("/results", { state: { result: item.data } })
                  }
                  className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-primary/30 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-neutral-400 group-hover:text-primary transition-colors">
                      {item.date}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                        item.verdict === "red"
                          ? "bg-red-100 text-red-600"
                          : item.verdict === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.risk} Score
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-neutral-800 truncate">
                    {item.type}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dev Mode Button for UI Testing */}
      <button
        onClick={() => {
          const MOCK_RESULT = {
            document_type: "Terms of Service",
            key_facts: {
              parties: "User and Acme Corp",
              duration: "Monthly, auto-renewing",
              jurisdiction: "California, USA",
            },
            risk_score: 92,
            verdict: "red",
            verdict_reason:
              "The Terms of Service contain multiple high-risk clauses and contradictions that significantly favor the provider and put the user's rights and data at risk.",
            top_concerns: [
              "Unrestricted data sharing and usage",
              "Lack of control over account termination and license revocation",
              "Mandatory arbitration and waiver of legal rights",
            ],
            clauses: [
              {
                id: 1,
                original:
                  "This agreement is between you (the User) and Acme Corp, governed by the laws of California, USA.",
                plain_english:
                  "This agreement says that any disputes will be settled through arbitration, not in a regular court.",
                category: "Arbitration",
                risk_level: "Medium",
                reason:
                  "You might not be able to take your case to a regular judge or jury.",
              },
              {
                id: 2,
                original:
                  "1. LICENSE GRANT. Acme Corp grants you a limited, non-exclusive, revocable license to use the Service. Acme Corp may revoke this license at any time, for any reason, without notice.",
                plain_english:
                  "They can shut down your access to the service at any time, without warning.",
                category: "Data Ownership",
                risk_level: "High",
                reason:
                  "They can revoke your license at any time, for any reason.",
                deep_dive:
                  'Worst-case implication: Acme Corp can abruptly revoke access to critical data or services, causing business disruption or loss. \nFairer version: "Acme Corp may revoke this license with 30 days\' notice, for material breach or non-payment, allowing for transition."',
              },
              {
                id: 3,
                original:
                  "2. USER DATA. You grant Acme Corp a perpetual, irrevocable, worldwide license to use, modify, distribute, and create derivative works from any content you upload. Acme Corp may share your data with third-party partners for business purposes.",
                plain_english:
                  "You're giving Acme Corp permanent permission to use, modify, and share any content you upload.",
                category: "Data Ownership",
                risk_level: "High",
                reason:
                  "They can use and share your data forever, without your consent.",
                deep_dive:
                  'Worst-case implication: Acme Corp could sell your uploaded content to advertisers. \nFairer version: "Acme Corp may use your uploaded content for internal purposes, with your prior consent for external sharing."',
              },
            ],
            contradictions: [
              {
                clause_a: 3,
                clause_b: 4,
                explanation:
                  "Clause 3 allows Acme Corp to share user data with third-party partners, while Clause 4 states that personal data will not be shared with third parties without consent, creating a contradiction.",
              },
            ],
            executive_summary:
              "Acme Corp's Terms of Service raises concerns about data sharing and account control. The contract has contradictions, such as sharing data despite promising not to. This agreement heavily favors Acme Corp, with a high risk score of 92/100, indicating potential issues for users.",
            email_draft:
              "Hi Team,\n\nI've reviewed the Acme Corp Terms of Service. There are several critical red flags we need to address before signing, specifically around unrestricted data sharing (Clause 3) and immediate account termination without notice (Clause 2).\n\nAdditionally, there's a contradiction between Clause 3 and 4 regarding data privacy that needs clarification.\n\nLet's push back on these points.",
            suggested_questions: [
              "What exactly constitutes a 'business purpose' for data sharing in Clause 3?",
              "Can we negotiate a 30-day cure period for the termination clause?",
            ],
          };
          navigate("/results", { state: { result: MOCK_RESULT } });
        }}
        className="mt-12 px-6 py-2 bg-neutral-900 text-white text-xs font-bold rounded-full opacity-50 hover:opacity-100 transition-opacity"
      >
        🎨 UI Dev Mode: View Mockup Results
      </button>
    </div>
  );
}

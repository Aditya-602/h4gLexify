"""
Main orchestration — chains all analysis steps.
This is the brain of the agentic pipeline.
"""

import json
import concurrent.futures
from groq_client import call_groq, call_groq_json, MODEL_HEAVY, MODEL_FAST
from taxonomy import get_taxonomy
from prompts import *


def run_pipeline(doc_text: str, progress_callback=None):
    def progress(msg):
        if progress_callback:
            progress_callback(msg)

    # ── STEP 0: Autonomous Web Fetching (The Rabbit Hole) ──
    import re
    urls = re.findall(r'(https?://[^\s)\]\'"]+)', doc_text)
    if urls:
        unique_urls = list(set(urls))[:2] # Limit to 2 to prevent infinite loops/spam
        for url in unique_urls:
            progress(f"Found embedded URL: {url} — scraping external policy...")
            try:
                from extractor import extract_from_url
                extra_text = extract_from_url(url)
                doc_text += f"\n\n--- CONTENT FROM {url} ---\n\n{extra_text}"
                progress(f"Successfully scraped and appended external policy from {url}")
            except Exception as e:
                progress(f"Attempted to scrape {url} but failed: {str(e)}")

    first_600_words = " ".join(doc_text.split()[:600])

    # Helper functions for parallel execution
    def get_key_facts():
        try:
            res = call_groq_json(KEY_FACTS_PROMPT.format(text=first_600_words), KEY_FACTS_SYSTEM)
            progress(f"Key facts extracted — Parties: {res.get('parties', 'N/A')}")
            return res
        except Exception:
            return {"parties": "Not specified", "duration": "Not specified", "jurisdiction": "Not specified"}

    def get_doc_type():
        res = call_groq(DOC_TYPE_PROMPT.format(text=first_600_words), DOC_TYPE_SYSTEM).strip()
        valid_types = ["Terms of Service", "NDA", "Employment Contract", "Rental Agreement", "Privacy Policy", "Other"]
        if res not in valid_types:
            for vt in valid_types:
                if vt.lower() in res.lower():
                    res = vt
                    break
            else:
                res = "Other"
        progress(f"Document type detected: {res}")
        return res

    def get_clauses():
        res = call_groq_json(CLAUSE_SPLIT_PROMPT.format(text=doc_text), CLAUSE_SPLIT_SYSTEM)
        if not isinstance(res, list) or len(res) == 0:
            raise ValueError("Failed to identify clause boundaries.")
        progress(f"{len(res)} clauses found")
        return res

    progress("Starting initial analysis (extracting facts, detecting type, identifying clauses)...")
    
    # ── STEP 1: Run independent tasks concurrently ──
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_key_facts = executor.submit(get_key_facts)
        future_doc_type = executor.submit(get_doc_type)
        future_clauses = executor.submit(get_clauses)
        
        key_facts = future_key_facts.result()
        doc_type = future_doc_type.result()
        clauses_raw = future_clauses.result()

    # Taxonomy
    taxonomy = get_taxonomy(doc_type)
    categories = taxonomy["categories"]
    progress(f"Risk taxonomy loaded — {len(categories)} categories for {doc_type}")

    # ── STEP 2: Per-Clause Analysis (Concurrent) ──
    progress("Analyzing clauses concurrently...")
    
    def analyze_clause(i, clause):
        clause_id = clause.get("id", i + 1)
        clause_text = clause.get("text", "")

        analysis = None
        for attempt in range(3):
            try:
                analysis = call_groq_json(
                    CLAUSE_ANALYSIS_PROMPT.format(doc_type=doc_type, categories=", ".join(categories), clause_text=clause_text),
                    CLAUSE_ANALYSIS_SYSTEM, model=MODEL_FAST,
                )
                if all(k in analysis for k in ["plain_english", "category", "risk_level", "reason"]):
                    break
                analysis = None
            except Exception:
                analysis = None

        if analysis is None:
            analysis = {"plain_english": "Could not analyze this clause.", "category": "Unclassified", "risk_level": "Medium", "reason": "Analysis failed after retries", "confidence": "low"}

        risk_level = analysis.get("risk_level", "None")
        deep_dive = None
        if risk_level == "High":
            progress(f"⚠ High risk in clause {clause_id} — running deep dive...")
            try:
                deep_dive = call_groq(DEEP_DIVE_PROMPT.format(doc_type=doc_type, clause_text=clause_text, reason=analysis.get("reason", "")), DEEP_DIVE_SYSTEM)
            except Exception:
                deep_dive = "Deep dive analysis unavailable."

        clause_result = {"id": clause_id, "original": clause_text, "plain_english": analysis["plain_english"], "category": analysis["category"], "risk_level": risk_level, "reason": analysis.get("reason", "")}
        if deep_dive:
            clause_result["deep_dive"] = deep_dive
            
        progress(f"Finished analyzing clause {clause_id}")
        return clause_result

    analyzed_clauses = []
    risk_ledger = {"High": [], "Medium": [], "Low": [], "None": []}

    # Using ThreadPoolExecutor to process clauses in parallel
    # We use max_workers=4 to speed up analysis significantly without hitting Groq free tier rate limits
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(analyze_clause, i, c) for i, c in enumerate(clauses_raw)]
        for future in concurrent.futures.as_completed(futures):
            clause_result = future.result()
            analyzed_clauses.append(clause_result)
            risk_ledger.get(clause_result["risk_level"], risk_ledger["None"]).append(clause_result)
            
    # Sort analyzed clauses back by ID since as_completed returns out of order
    analyzed_clauses.sort(key=lambda x: x["id"])

    progress("All clauses analyzed")

    # ── STEP 3: Sequential Final Analysis ──
    # Contradictions
    progress("Running contradiction scan...")
    clauses_for_contradiction = json.dumps([{"id": c["id"], "text": c["original"], "category": c["category"]} for c in analyzed_clauses], indent=2)
    try:
        contradictions = call_groq_json(CONTRADICTION_PROMPT.format(doc_type=doc_type, clauses_json=clauses_for_contradiction), CONTRADICTION_SYSTEM)
        if not isinstance(contradictions, list):
            contradictions = []
    except Exception:
        contradictions = []

    if contradictions:
        for c in contradictions:
            progress(f"⚠ Contradiction found between clause {c.get('clause_a')} and clause {c.get('clause_b')}")
    else:
        progress("No contradictions found")

    # Risk Score
    progress("Calculating risk score...")
    high_details = "\n".join([f"- Clause {c['id']}: {c['reason']}" for c in risk_ledger["High"]]) or "None"
    contradiction_details = "\n".join([f"- Clauses {c['clause_a']} & {c['clause_b']}: {c['explanation']}" for c in contradictions]) or "None"

    try:
        score_result = call_groq_json(RISK_SCORE_PROMPT.format(
            doc_type=doc_type, total_clauses=len(analyzed_clauses), high_count=len(risk_ledger["High"]),
            medium_count=len(risk_ledger["Medium"]), low_count=len(risk_ledger["Low"]),
            contradiction_count=len(contradictions), high_risk_details=high_details, contradiction_details=contradiction_details,
        ), RISK_SCORE_SYSTEM)
    except Exception:
        score_result = {"risk_score": 50, "verdict": "yellow", "verdict_reason": "Could not compute precise risk score.", "top_concerns": ["Manual review recommended"]}

    progress(f"Risk score: {score_result.get('risk_score', '?')}/100 — Verdict: {score_result.get('verdict', '?')}")

    # ── STEP 4: Agentic Features (Concurrent) ──
    progress("Running agentic tasks (Exec Summary, Email Draft, Suggested Questions)...")
    
    def get_exec_summary():
        try:
            return call_groq(EXEC_SUMMARY_PROMPT.format(
                doc_type=doc_type, risk_score=score_result.get("risk_score", "N/A"), verdict=score_result.get("verdict", "N/A"),
                key_facts=json.dumps(key_facts), top_concerns=json.dumps(score_result.get("top_concerns", [])), contradictions=json.dumps(contradictions),
            ), EXEC_SUMMARY_SYSTEM)
        except Exception:
            return "Executive summary could not be generated."
            
    def get_email_draft():
        try:
            return call_groq(EMAIL_DRAFT_PROMPT.format(
                doc_type=doc_type, top_concerns=json.dumps(score_result.get("top_concerns", [])), verdict=score_result.get("verdict", "yellow")
            ), EMAIL_DRAFT_SYSTEM)
        except Exception:
            return "Email draft could not be generated."
            
    def get_suggested_questions():
        if score_result.get("verdict", "yellow") == "green":
            return ["Are there any upcoming changes to this agreement?", "How do I request a copy of my signed document?", "Who is my main point of contact?"]
        try:
            return call_groq_json(QUESTIONS_PROMPT.format(
                doc_type=doc_type, high_risk_details=high_details, contradiction_details=contradiction_details
            ), QUESTIONS_SYSTEM)
        except Exception:
            return ["Could you clarify the highest risk clauses?", "Are any of these terms negotiable?"]

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_summary = executor.submit(get_exec_summary)
        future_email = executor.submit(get_email_draft)
        future_questions = executor.submit(get_suggested_questions)
        
        exec_summary = future_summary.result()
        email_draft = future_email.result()
        suggested_questions = future_questions.result()

    # ── STEP 5: Auto-Negotiator (Redline Generator) ──
    progress("Generating amended redline document...")
    amended_document = doc_text
    for c in risk_ledger["High"]:
        if "deep_dive" in c and "Fairer version:" in c["deep_dive"]:
            fairer_version = c["deep_dive"].split("Fairer version:")[1].strip().strip('"')
            # Replace the original highly-risky text with the fairer version in the raw document
            amended_document = amended_document.replace(c["original"], f"**[AMENDED]** {fairer_version}")

    progress("Done!")

    return {
        "document_type": doc_type, 
        "key_facts": key_facts,
        "risk_score": score_result.get("risk_score", 50), 
        "verdict": score_result.get("verdict", "yellow"),
        "verdict_reason": score_result.get("verdict_reason", ""), 
        "top_concerns": score_result.get("top_concerns", []),
        "aggressiveness_score": score_result.get("aggressiveness_score", 5),
        "industry_standard_comparison": score_result.get("industry_standard_comparison", "Analysis unavailable."),
        "clauses": analyzed_clauses, 
        "contradictions": contradictions, 
        "executive_summary": exec_summary,
        "email_draft": email_draft,
        "suggested_questions": suggested_questions,
        "amended_document": amended_document
    }

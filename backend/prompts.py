"""
All prompt templates in one place.
Every Groq call uses a prompt from here — no inline prompt strings.
"""

# ── Stage 2: Key Facts ──────────────────────────────────────────────

KEY_FACTS_SYSTEM = "You are a legal document analyst. Extract key facts concisely."

KEY_FACTS_PROMPT = """Analyze the beginning of this legal document and extract key facts.

Document excerpt (first 600 words):
---
{text}
---

Return ONLY valid JSON in this exact format:
{{
  "parties": "who the parties are (e.g., 'User and Acme Corp')",
  "duration": "contract duration or term (e.g., 'Monthly, auto-renewing')",
  "jurisdiction": "governing law or jurisdiction (e.g., 'California, USA')"
}}

If any field cannot be determined, use "Not specified".
Return ONLY the JSON, no other text."""


# ── Stage 3: Document Type Detection ────────────────────────────────

DOC_TYPE_SYSTEM = "You are a legal document classifier. Respond with only the document type."

DOC_TYPE_PROMPT = """Read the beginning of this legal document and classify its type.

Document excerpt (first 600 words):
---
{text}
---

Respond with EXACTLY one of these types (nothing else):
- Terms of Service
- NDA
- Employment Contract
- Rental Agreement
- Privacy Policy
- Other

Your response must be ONLY the type name, no explanation."""


# ── Stage 3: Clause Boundary Detection ──────────────────────────────

CLAUSE_SPLIT_SYSTEM = "You are a legal document parser. Split documents into individual clauses."

CLAUSE_SPLIT_PROMPT = """Split this legal document into individual clauses. Each clause should be a distinct legal provision or section.

Document:
---
{text}
---

Return ONLY valid JSON as an array of objects:
[
  {{"id": 1, "text": "full text of clause 1"}},
  {{"id": 2, "text": "full text of clause 2"}},
  ...
]

Rules:
- Each clause should be a complete, self-contained legal provision
- Preserve the original text exactly
- Number them sequentially starting from 1
- Aim for 5-20 clauses depending on document length
- Do not split mid-sentence
- Return ONLY the JSON array, no other text"""


# ── Stage 4: Per-Clause Analysis ────────────────────────────────────

CLAUSE_ANALYSIS_SYSTEM = """You are a legal risk analyst who explains things in plain, everyday language. 
Your job is to translate legal jargon into simple words that anyone — even a teenager — can understand immediately. 
No legal terms. No formal tone. Just clear, honest, conversational English."""

CLAUSE_ANALYSIS_PROMPT = """Analyze this legal clause for risk to the consumer/individual.

Document type: {doc_type}
Risk categories to consider: {categories}

Clause:
---
{clause_text}
---

Return ONLY valid JSON:
{{
  "plain_english": "Explain what this clause ACTUALLY means for the person signing — in one short sentence, using everyday words. Write like you're warning a friend. No legal jargon. Examples: 'They can delete your account whenever they want, no warning.' or 'You're giving them permission to use your photos forever.' or 'You can't sue them, even if they mess up badly.'",
  "category": "one of the risk categories listed above, or 'General' if none fit",
  "risk_level": "High or Medium or Low or None",
  "reason": "one-line reason if risk is Medium or High, otherwise empty string",
  "confidence": "high or medium or low"
}}

Return ONLY the JSON, no other text."""


# ── Stage 4: Deep Dive (High Risk only) ────────────────────────────

DEEP_DIVE_SYSTEM = "You are a consumer rights legal expert. Explain worst-case implications."

DEEP_DIVE_PROMPT = """This clause has been flagged as HIGH RISK in a {doc_type}.

Clause:
---
{clause_text}
---

Initial assessment: {reason}

Provide a brief deep dive:
1. What is the worst-case real-world implication for the person signing?
2. What would a fairer version of this clause look like?

Keep your response under 100 words total. Be specific, not generic."""


# ── Stage 5: Contradiction Detection ────────────────────────────────

CONTRADICTION_SYSTEM = "You are a legal document analyst specializing in finding contradictions."

CONTRADICTION_PROMPT = """Review all clauses from this {doc_type} and identify any contradictions — places where one clause promises something that another clause takes away or undermines.

Clauses:
---
{clauses_json}
---

Return ONLY valid JSON as an array (empty array [] if no contradictions found):
[
  {{
    "clause_a": <id of first clause>,
    "clause_b": <id of second clause>,
    "explanation": "brief explanation of the contradiction"
  }}
]

Only flag genuine contradictions, not merely related clauses.
Return ONLY the JSON array, no other text."""


# ── Stage 5: Risk Score & Verdict ───────────────────────────────────

RISK_SCORE_SYSTEM = "You are a legal risk scoring expert."

RISK_SCORE_PROMPT = """Based on the complete analysis of this {doc_type}, compute a risk score.

Analysis summary:
- Total clauses: {total_clauses}
- High risk clauses: {high_count}
- Medium risk clauses: {medium_count}
- Low risk clauses: {low_count}
- Contradictions found: {contradiction_count}

High risk findings:
{high_risk_details}

Contradictions:
{contradiction_details}

Return ONLY valid JSON:
{{
  "risk_score": <number from 0 to 100, where 100 is extremely risky>,
  "verdict": "green or yellow or red",
  "verdict_reason": "one sentence explaining the verdict",
  "top_concerns": ["concern 1", "concern 2", "concern 3"],
  "aggressiveness_score": <number from 1 to 10, comparing this contract to industry standards>,
  "industry_standard_comparison": "one short sentence explaining if this contract is more aggressive or standard compared to industry norms"
}}

Scoring guide:
- 0-30: green (mostly safe)
- 31-60: yellow (proceed with caution)
- 61-100: red (significant risks, review before signing)

Return ONLY the JSON, no other text."""


# ── Stage 5: Executive Summary ──────────────────────────────────────

EXEC_SUMMARY_SYSTEM = "You are a legal document summarizer writing for non-lawyers."

EXEC_SUMMARY_PROMPT = """Write a 3-4 sentence executive summary of this {doc_type} analysis.

Document type: {doc_type}
Risk score: {risk_score}/100
Verdict: {verdict}
Key facts: {key_facts}
Top concerns: {top_concerns}
Contradictions: {contradictions}

Write as if explaining to someone who has never read a legal document.
Be specific to THIS document — do not write a generic summary.
Keep it under 80 words."""


# ── Stage 5: Proactive Questions & Email Draft ──────────────────────

QUESTIONS_SYSTEM = "You are a legal advisor suggesting the most critical questions a client should ask based on a contract review."

QUESTIONS_PROMPT = """Based on the high risks and contradictions found in this {doc_type}, generate the 3 most important questions the user should ask the other party before signing.

High risks: {high_risk_details}
Contradictions: {contradiction_details}

Return ONLY valid JSON as an array of 3 strings:
[
  "Question 1?",
  "Question 2?",
  "Question 3?"
]
"""

EMAIL_DRAFT_SYSTEM = "You are a professional negotiator drafting a polite pushback email for a contract."

EMAIL_DRAFT_PROMPT = """Draft a polite, professional email to the sender of this {doc_type}. The user wants to push back on the most concerning clauses and propose fairer terms.

Document type: {doc_type}
Top concerns: {top_concerns}
Verdict: {verdict}

If the verdict is 'green', write a short email simply saying the contract looks good and will be signed.
If the verdict is 'yellow' or 'red', write an email politely addressing the top concerns and proposing amendments.
Keep it under 150 words. Do not use placeholders like [Your Name] unless absolutely necessary.
Return ONLY the raw email text, no JSON or formatting."""

# ── Stage 8: Follow-Up Chat ─────────────────────────────────────────

CHAT_SYSTEM = """You are a legal document assistant. You have already analyzed a legal document and produced a full risk report.

Document type: {doc_type}
Document text:
---
{doc_text}
---

Full analysis:
{analysis_json}

Answer the user's question based on the document and your analysis. Be specific. Reference clause numbers when relevant. Keep answers concise."""

CHAT_PROMPT = "{user_question}"

"""
Groq API wrapper — all LLM calls go through here.
Two models:
  - llama3-70b-8192 for heavy tasks (doc detection, contradictions, summary)
  - llama3-8b-8192 for per-clause classification (speed)
"""

import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_HEAVY = "meta-llama/llama-4-scout-17b-16e-instruct"
MODEL_FAST = "meta-llama/llama-4-scout-17b-16e-instruct"


def call_groq(prompt: str, system_prompt: str = "", model: str = MODEL_HEAVY, temperature: float = 0.2) -> str:
    """
    Single point of contact for all Groq calls.
    Returns the raw text response from the model.
    """
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=4096,
    )
    return response.choices[0].message.content


def call_groq_json(prompt: str, system_prompt: str = "", model: str = MODEL_HEAVY, temperature: float = 0.1) -> dict | list:
    """
    Calls Groq and attempts to parse the response as JSON.
    Strips markdown code fences if present.
    """
    raw = call_groq(prompt, system_prompt, model, temperature)

    # Strip markdown code fences
    cleaned = raw.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    return json.loads(cleaned)


def test_connection() -> dict:
    """Quick test to verify the Groq API key works."""
    try:
        response = call_groq("Say 'connection successful' and nothing else.")
        return {"status": "ok", "response": response}
    except Exception as e:
        return {"status": "error", "error": str(e)}

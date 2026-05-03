"""
Flask app — routes, SSE endpoint, and API.
"""

import json
import queue
import threading
import uuid

from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

from extractor import extract_from_pdf, extract_from_url, extract_from_text
from groq_client import test_connection, call_groq
from pipeline import run_pipeline
from prompts import CHAT_SYSTEM, CHAT_PROMPT

app = Flask(__name__)
CORS(app)

sessions = {}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Legal Analyzer backend is running"})


@app.route("/api/test-groq", methods=["GET"])
def test_groq():
    result = test_connection()
    return jsonify(result)


@app.route("/api/analyze", methods=["POST"])
def analyze():
    session_id = str(uuid.uuid4())
    progress_queue = queue.Queue()

    try:
        if "file" in request.files:
            file = request.files["file"]
            if not file.filename.lower().endswith(".pdf"):
                return jsonify({"error": "Only PDF files are supported"}), 400
            file_bytes = file.read()
            doc_text = extract_from_pdf(file_bytes)
            progress_queue.put(("progress", "Document received — PDF uploaded"))
        elif request.is_json:
            data = request.get_json()
            if "url" in data:
                progress_queue.put(("progress", "Fetching URL..."))
                doc_text = extract_from_url(data["url"])
                progress_queue.put(("progress", "Document received — content extracted from URL"))
            elif "text" in data:
                doc_text = extract_from_text(data["text"])
                progress_queue.put(("progress", "Document received — raw text input"))
            else:
                return jsonify({"error": "Provide 'file', 'url', or 'text'"}), 400
        else:
            return jsonify({"error": "Provide 'file', 'url', or 'text'"}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    result_holder = {}

    def run_in_background():
        def progress_callback(msg):
            progress_queue.put(("progress", msg))
        try:
            result = run_pipeline(doc_text, progress_callback)
            result_holder["result"] = result
            sessions[session_id] = {"doc_text": doc_text, "analysis": result}
            progress_queue.put(("result", json.dumps({"session_id": session_id, **result})))
        except Exception as e:
            progress_queue.put(("error", str(e)))
        progress_queue.put(("done", ""))

    thread = threading.Thread(target=run_in_background)
    thread.start()

    def generate():
        while True:
            try:
                event_type, data = progress_queue.get(timeout=120)
            except queue.Empty:
                yield "event: error\ndata: Analysis timed out\n\n"
                break
            if event_type == "done":
                yield "event: done\ndata: complete\n\n"
                break
            elif event_type == "error":
                yield f"event: error\ndata: {data}\n\n"
                break
            elif event_type == "result":
                yield f"event: result\ndata: {data}\n\n"
            else:
                yield f"event: progress\ndata: {data}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    session_id = data.get("session_id")
    question = data.get("question")
    if not session_id or not question:
        return jsonify({"error": "session_id and question are required"}), 400
    session = sessions.get(session_id)
    if not session:
        return jsonify({"error": "Session not found. Please analyze a document first."}), 404
    try:
        system_prompt = CHAT_SYSTEM.format(
            doc_type=session["analysis"]["document_type"],
            doc_text=session["doc_text"][:3000],
            analysis_json=json.dumps(session["analysis"], indent=2)[:3000],
        )
        answer = call_groq(CHAT_PROMPT.format(user_question=question), system_prompt)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"Chat failed: {str(e)}"}), 500


if __name__ == "__main__":
    print("\n🔍 Legal Document Analyzer — Backend")
    print("=" * 45)
    print("  POST /api/analyze    — Analyze document (SSE)")
    print("  POST /api/chat       — Follow-up questions")
    print("  GET  /api/health     — Health check")
    print("  GET  /api/test-groq  — Test Groq connection")
    print("=" * 45)
    app.run(debug=True, port=5000, threaded=True)

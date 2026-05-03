"""
Text extraction from PDF, URL, and raw text.
All three normalize into clean text.
"""

import re
import fitz  # PyMuPDF
import requests
from bs4 import BeautifulSoup


def extract_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from PDF bytes using PyMuPDF.
    Returns clean text or raises ValueError if no text found (scanned PDF).
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages_text = []
    for page in doc:
        text = page.get_text()
        if text.strip():
            pages_text.append(text.strip())
    doc.close()

    if not pages_text:
        raise ValueError(
            "This document appears to be a scanned image. "
            "Text extraction is not supported. Please provide a text-based PDF."
        )

    raw = "\n\n".join(pages_text)
    return normalize_text(raw)


def extract_from_url(url: str) -> str:
    """
    Fetch HTML from URL and extract meaningful text content.
    Strips nav, footer, scripts, styles, cookie banners.
    """
    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (compatible; LegalAnalyzer/1.0)"
        })
        resp.raise_for_status()
    except requests.RequestException as e:
        raise ValueError(f"Could not fetch URL: {str(e)}")

    soup = BeautifulSoup(resp.text, "html.parser")

    # Remove non-content elements
    for tag in soup(["script", "style", "nav", "footer", "header", "aside",
                     "iframe", "noscript", "form"]):
        tag.decompose()

    # Remove common cookie/banner classes
    for el in soup.find_all(class_=re.compile(r"cookie|banner|popup|modal|consent", re.I)):
        el.decompose()

    text = soup.get_text(separator="\n")

    if len(text.strip()) < 100:
        raise ValueError(
            "Could not extract meaningful content from this URL. "
            "The page may require JavaScript to render."
        )

    return normalize_text(text)


def extract_from_text(raw_text: str) -> str:
    """Normalize raw text input."""
    if not raw_text or len(raw_text.strip()) < 50:
        raise ValueError("Text input is too short to analyze. Please provide a complete document.")
    return normalize_text(raw_text)


def normalize_text(text: str) -> str:
    """
    Clean up extracted text:
    - Fix encoding issues
    - Collapse excessive whitespace
    - Remove page number artifacts
    - Produce one clean unified string
    """
    # Replace common encoding artifacts
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    text = text.replace("\xa0", " ")

    # Remove standalone page numbers (e.g., "Page 3", "- 5 -", "3 of 10")
    text = re.sub(r"\n\s*Page\s+\d+\s*(of\s+\d+)?\s*\n", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"\n\s*-\s*\d+\s*-\s*\n", "\n", text)
    text = re.sub(r"\n\s*\d+\s*\n", "\n", text)

    # Collapse excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse excessive spaces
    text = re.sub(r" {2,}", " ", text)

    return text.strip()

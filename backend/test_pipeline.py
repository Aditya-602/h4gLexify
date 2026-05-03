"""Quick test: runs the full pipeline on a sample ToS and prints the result."""
import json
from extractor import extract_from_text
from pipeline import run_pipeline

sample_tos = """TERMS OF SERVICE

Effective Date: January 1, 2025

This agreement is between you (the User) and Acme Corp, governed by the laws of California, USA.

1. LICENSE GRANT. Acme Corp grants you a limited, non-exclusive, revocable license to use the Service. Acme Corp may revoke this license at any time, for any reason, without notice.

2. USER DATA. You grant Acme Corp a perpetual, irrevocable, worldwide license to use, modify, distribute, and create derivative works from any content you upload. Acme Corp may share your data with third-party partners for business purposes.

3. PRIVACY. We value your privacy. Your personal data will not be shared with third parties without your consent.

4. AUTO-RENEWAL. Your subscription automatically renews each month. There is no cancellation window. You must contact support 60 days before renewal to cancel.

5. LIMITATION OF LIABILITY. Acme Corp shall not be liable for any damages whatsoever, including but not limited to direct, indirect, incidental, or consequential damages, arising from your use of the Service.

6. MODIFICATIONS. Acme Corp reserves the right to modify these terms at any time without prior notice. Continued use constitutes acceptance.

7. ARBITRATION. Any disputes shall be resolved through binding arbitration in San Francisco, CA. You waive your right to a jury trial or class action lawsuit.

8. TERMINATION. Acme Corp may terminate your account at any time without cause or notice. Upon termination, all your data will be permanently deleted."""

doc_text = extract_from_text(sample_tos)
result = run_pipeline(doc_text, progress_callback=lambda msg: print(f"  → {msg}"))

print("\n" + "=" * 60)
print("FINAL RESULT:")
print("=" * 60)
print(json.dumps(result, indent=2))

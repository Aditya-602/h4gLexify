"""
Risk taxonomies per document type.
Each document type has its own set of risk categories and red flags.
"""

TAXONOMIES = {
    "Terms of Service": {
        "categories": [
            "Data Ownership",
            "Data Sharing",
            "Auto-Renewal",
            "Unilateral Modification",
            "Liability Waiver",
            "Arbitration",
            "IP Rights",
            "Account Termination",
        ],
        "description": "SaaS or platform terms of service agreement",
    },
    "Privacy Policy": {
        "categories": [
            "Data Ownership",
            "Data Sharing",
            "Auto-Renewal",
            "Unilateral Modification",
            "Liability Waiver",
            "Arbitration",
            "IP Rights",
            "Account Termination",
        ],
        "description": "Privacy and data handling policy",
    },
    "NDA": {
        "categories": [
            "Confidentiality Scope",
            "Duration",
            "Non-Compete",
            "One-Sidedness",
            "Penalty Clauses",
            "Definition of Confidential Info",
        ],
        "description": "Non-disclosure agreement",
    },
    "Employment Contract": {
        "categories": [
            "Compensation",
            "Termination",
            "Non-Compete",
            "IP Ownership",
            "Notice Period",
            "Probation Terms",
        ],
        "description": "Employment or contractor agreement",
    },
    "Rental Agreement": {
        "categories": [
            "Rent Terms",
            "Maintenance Responsibility",
            "Early Termination",
            "Deposit Conditions",
            "Entry Rights",
            "Subletting",
        ],
        "description": "Residential or commercial rental/lease agreement",
    },
    "Other": {
        "categories": [
            "Obligations",
            "Liability",
            "Termination",
            "Penalties",
            "Dispute Resolution",
            "Modification Rights",
        ],
        "description": "General legal document",
    },
}


def get_taxonomy(doc_type: str) -> dict:
    """
    Returns the risk taxonomy for a given document type.
    Falls back to 'Other' if type not recognized.
    """
    # Try exact match first
    if doc_type in TAXONOMIES:
        return TAXONOMIES[doc_type]

    # Try fuzzy match
    doc_type_lower = doc_type.lower()
    for key in TAXONOMIES:
        if key.lower() in doc_type_lower or doc_type_lower in key.lower():
            return TAXONOMIES[key]

    return TAXONOMIES["Other"]

"""Prompt templates for the AI Career Assistant module.

The system prompts implement the PRD's hallucination-mitigation strategy
(§3.3):

* **Strict grounding** - only recommend roles/drives present in the retrieved
  context.
* **Explicit unknowns** - if the answer is not in the context, say so instead of
  guessing.
* **Structured context** - records are injected as JSON so the model can tell
  database facts apart from general knowledge.
"""

from __future__ import annotations

import json
from typing import Any

# ----------------------------------------------------------------------
# Career chat
# ----------------------------------------------------------------------
_CHAT_SYSTEM = (
    "You are CampusConnect's AI Career Assistant, helping a student with "
    "placement and career questions.\n\n"
    "GROUNDING RULES (mandatory):\n"
    "1. Use ONLY the facts in STRUCTURED_CONTEXT_JSON to make claims about the "
    "student's profile, skills, eligibility and available drives.\n"
    "2. Recommend ONLY job roles and placement drives that appear in the context. "
    "Never invent companies, drives, deadlines or eligibility criteria.\n"
    "3. If the context does not contain enough information to answer, say so "
    "explicitly (set insufficientContext to true) instead of guessing.\n"
    "4. General career advice (how to prepare, study tips) is allowed, but keep it "
    "clearly separate from student-specific facts.\n"
    "5. Be concise, specific and encouraging.\n\n"
    "Respond with STRICT JSON only, matching this schema exactly: "
    '{"answer": string, "insufficientContext": boolean}. '
    "Do not include any prose outside the JSON."
)


def build_chat_prompt(
    *,
    question: str,
    context: dict[str, Any],
) -> tuple[str, str]:
    """Build the grounded chat prompt.

    ``context`` is the structured JSON produced by the RAG retrieval service.
    """
    prompt = f"""STUDENT_QUESTION: {question}

STRUCTURED_CONTEXT_JSON:
{json.dumps(context, indent=2, default=str)}

TASK:
Answer the student's question using only the context above. Follow the grounding
rules in the system instruction and return the JSON object."""
    return _CHAT_SYSTEM, prompt


# ----------------------------------------------------------------------
# Resume Q&A
# ----------------------------------------------------------------------
_RESUME_SYSTEM = (
    "You are an AI assistant answering questions about a student's resume. "
    "Use ONLY the resume data provided in the prompt. If the resume does not "
    "contain the requested information, say so plainly. Be specific and practical, "
    "and keep answers to a short paragraph. Respond with plain text (no JSON)."
)


def build_resume_qa_prompt(
    *,
    question: str,
    has_resume: bool,
    resume_summary: str,
) -> tuple[str, str]:
    """Build the resume-Q&A prompt.

    ``resume_summary`` is a compact textual digest of the student's parsed
    resume, skills, projects and latest resume analysis.
    """
    prompt = f"""HAS_RESUME: {"true" if has_resume else "false"}

RESUME_SUMMARY:
{resume_summary or "(no parsed resume data available)"}

STUDENT_QUESTION: {question}

TASK:
Answer the question using only the resume data above."""
    return _RESUME_SYSTEM, prompt


# ----------------------------------------------------------------------
# Guidance / roadmap
# ----------------------------------------------------------------------
_GUIDANCE_SYSTEM = (
    "You are an expert career counsellor. Using ONLY the structured student "
    "context provided, produce a personalised career roadmap that targets the "
    "given role and closes the identified skill gaps. Recommend skills, projects "
    "and certifications that are realistic for the student, and order the roadmap "
    "steps logically. Do not invent companies or drives. "
    "Respond with STRICT JSON only, matching this schema exactly: "
    '{"recommendedRole": string, "reasoning": string, '
    '"skillsToLearn": [string], '
    '"projectsToBuild": [{"title": string, "description": string}], '
    '"certifications": [string], '
    '"roadmap": [{"step": string, "order": int}]}. '
    "Do not include any prose outside the JSON."
)


def build_guidance_prompt(
    *,
    target_role: str,
    context: dict[str, Any],
) -> tuple[str, str]:
    """Build the guidance/roadmap prompt."""
    prompt = f"""TARGET_ROLE: {target_role}

STRUCTURED_CONTEXT_JSON:
{json.dumps(context, indent=2, default=str)}

TASK:
Produce a personalised roadmap for the target role using only the context above.
Return the JSON object described in the system instruction."""
    return _GUIDANCE_SYSTEM, prompt

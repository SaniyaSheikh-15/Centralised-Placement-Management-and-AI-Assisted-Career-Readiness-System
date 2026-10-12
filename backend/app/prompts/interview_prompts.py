"""Prompt templates for the AI Mock Interview module.

Each builder returns ``(system_instruction, user_prompt)``. The user prompt
carries machine-readable hint lines so the offline stub can produce relevant,
schema-valid output; Gemini simply benefits from the explicit context.
"""

from __future__ import annotations

import json
from typing import Any

# ----------------------------------------------------------------------
# Question generation
# ----------------------------------------------------------------------
_QUESTION_SYSTEM = (
    "You are a senior technical interviewer conducting a realistic mock interview. "
    "You ask exactly ONE question at a time, tailored to the candidate's target role "
    "and demonstrated experience. Questions must be specific, non-repetitive and "
    "appropriate for the stated difficulty. "
    "Respond with STRICT JSON only, matching this schema exactly: "
    '{"questionText": string, "category": "Technical"|"Behavioral"|"System Design", '
    '"aiSuggestedAnswer": string}. '
    "Do not include any prose outside the JSON."
)


def build_question_prompt(
    *,
    role: str,
    difficulty: str,
    interview_type: str,
    question_number: int,
    total_questions: int,
    student_context: dict[str, Any],
    previous_questions: list[str],
) -> tuple[str, str]:
    """Build the question-generation prompt.

    Parameters
    ----------
    role, difficulty, interview_type:
        Interview configuration supplied by the student.
    question_number, total_questions:
        Position in the sequence (used for pacing/coverage).
    student_context:
        Retrieved profile/skills/projects used to personalise the question.
    previous_questions:
        Questions already asked, to avoid repetition.
    """
    prev = "\n".join(f"- {q}" for q in previous_questions) or "- (none yet)"
    prompt = f"""ROLE: {role}
DIFFICULTY: {difficulty}
INTERVIEW_TYPE: {interview_type}
QUESTION_NUMBER: {question_number}
TOTAL_QUESTIONS: {total_questions}

CANDIDATE_CONTEXT_JSON:
{json.dumps(student_context, indent=2, default=str)}

PREVIOUS_QUESTIONS:
{prev}

TASK:
Generate question number {question_number} of {total_questions} for this candidate.
Keep it {difficulty.lower()} level and aligned to the {interview_type} interview type.
Do not repeat any previous question. Return the JSON object described in the system instruction."""
    return _QUESTION_SYSTEM, prompt


# ----------------------------------------------------------------------
# Answer evaluation
# ----------------------------------------------------------------------
_EVALUATION_SYSTEM = (
    "You are an expert interview evaluator. Score the candidate's answer on SIX "
    "dimensions, each an integer 0-100: relevance, completeness, technical "
    "(role-specific knowledge), communication, fluency and grammar. Be fair but "
    "rigorous; reserve scores above 90 for outstanding answers. Provide specific, "
    "actionable feedback (2-3 sentences). "
    "Respond with STRICT JSON only, matching this schema exactly: "
    '{"relevance": int, "completeness": int, "technical": int, "communication": int, '
    '"fluency": int, "grammar": int, "feedback": string}. '
    "Do not include any prose outside the JSON."
)


def build_evaluation_prompt(
    *,
    role: str,
    difficulty: str,
    interview_type: str,
    question_text: str,
    answer: str,
) -> tuple[str, str]:
    """Build the answer-evaluation prompt for one question."""
    prompt = f"""ROLE: {role}
DIFFICULTY: {difficulty}
INTERVIEW_TYPE: {interview_type}

QUESTION:
{question_text}

CANDIDATE_ANSWER:
{answer}
END_CANDIDATE_ANSWER

TASK:
Evaluate the candidate's answer to the question above and return the JSON object
described in the system instruction, scoring each of the six dimensions 0-100."""
    return _EVALUATION_SYSTEM, prompt


# ----------------------------------------------------------------------
# Final summary
# ----------------------------------------------------------------------
_SUMMARY_SYSTEM = (
    "You are an expert interview coach writing a final report. Summarise the "
    "candidate's overall performance: 3-5 concrete strengths and 3-5 concrete, "
    "actionable improvements. Be specific to the role and the answers given. "
    "Respond with STRICT JSON only, matching this schema exactly: "
    '{"strengths": [string], "improvements": [string], "summary": string}. '
    "Do not include any prose outside the JSON."
)


def build_summary_prompt(
    *,
    role: str,
    difficulty: str,
    interview_type: str,
    per_question: list[dict[str, Any]],
) -> tuple[str, str]:
    """Build the end-of-session summary prompt.

    ``per_question`` is a compact list of ``{question, score, feedback}`` dicts
    so the model reasons over the whole session rather than a single turn.
    """
    prompt = f"""ROLE: {role}
DIFFICULTY: {difficulty}
INTERVIEW_TYPE: {interview_type}

PER_QUESTION_RESULTS_JSON:
{json.dumps(per_question, indent=2, default=str)}

TASK:
Produce the final report for this mock interview as the JSON object described in
the system instruction."""
    return _SUMMARY_SYSTEM, prompt

"""Prompt templates for the AI modules.

Prompts are isolated from business logic so they can be reviewed, versioned and
tested independently. Each builder returns a ``(system_instruction, user_prompt)``
tuple. The user prompt embeds machine-readable hint lines (``ROLE:`` etc.) that
both Gemini and the offline stub understand.
"""

from app.prompts.assistant_prompts import (
    build_chat_prompt,
    build_guidance_prompt,
    build_resume_qa_prompt,
)
from app.prompts.interview_prompts import (
    build_evaluation_prompt,
    build_question_prompt,
    build_summary_prompt,
)

__all__ = [
    "build_question_prompt",
    "build_evaluation_prompt",
    "build_summary_prompt",
    "build_chat_prompt",
    "build_guidance_prompt",
    "build_resume_qa_prompt",
]

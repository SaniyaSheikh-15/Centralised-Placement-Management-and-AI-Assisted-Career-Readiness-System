from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_id: UUID
    skill_name: str
    category: str | None = None
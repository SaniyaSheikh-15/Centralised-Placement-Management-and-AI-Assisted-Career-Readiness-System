from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_id: UUID
    skill_name: str
    category: str | None = None


class BranchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    branch_id: UUID
    branch_code: str
    branch_name: str
    department: str | None = None
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.schemas.master_data import SkillResponse
from backend.app.services.master_data_service import MasterDataService


router = APIRouter(
    prefix="/master-data",
    tags=["Master Data"],
)


@router.get(
    "/skills",
    response_model=list[SkillResponse],
    summary="Get Master Skills",
)
def get_master_skills(
    db: Session = Depends(get_db),
):
    return MasterDataService.get_skills(db)
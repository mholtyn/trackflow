from fastapi import FastAPI, status, APIRouter

from app.routers import users
from app.database import init_db


app = FastAPI(title="Trackflow",
              summary="A b2b platform for sharing track demos between labels and producers.",
              version="0.0.1")

api_router = APIRouter()
api_router.include_router(router=users.router)


@api_router.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {"Hello": "world!"}


app.include_router(router=api_router, prefix="/api")


@app.on_event("startup")
async def init_database() -> None:
    await init_db()
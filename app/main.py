from fastapi import FastAPI, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import users
from app.routers import tracks
from app.routers import workspaces
from app.routers import submissions
from app.database import init_db


app = FastAPI(title="Trackflow",
              summary="A b2b platform for sharing track demos between labels and producers.",
              version="1.0.0")

app.add_middleware(CORSMiddleware,
                   allow_origins=["http://localhost:5173",
                                  "http://trackflow-app.pl",
                                  "https://trackflow-app.pl"],
                   allow_headers=["*"],
                   allow_methods=["*"],
                   allow_credentials=True)

api_router = APIRouter()
api_router.include_router(router=users.router)
api_router.include_router(router=tracks.router)
api_router.include_router(router=workspaces.router)
api_router.include_router(router=submissions.router)


@api_router.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {"Hello": "world!"}


app.include_router(router=api_router, prefix="/api")

try:
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
except RuntimeError as e:
    print(
        f"Warning: Could not mount static files directory 'frontend/dist'. Ensure it exists. Error: {e}"
    )

@app.on_event("startup")
async def init_database() -> None:
    await init_db()
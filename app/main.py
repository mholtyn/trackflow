from pathlib import Path

from fastapi import FastAPI, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.routers import users
from app.routers import tracks
from app.routers import workspaces
from app.routers import submissions
from app.database import init_db


STATIC_DIR = Path("frontend/dist")
INDEX_PATH = STATIC_DIR / "index.html"


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


@app.get("/{full_path:path}")
async def serve_spa(full_path: str) -> FileResponse:
    """Serve static files from frontend/dist; fallback to index.html for SPA routes."""
    if not INDEX_PATH.exists():
        raise RuntimeError("frontend/dist/index.html not found. Build the frontend before running.")
    file_path = (STATIC_DIR / full_path).resolve()
    if file_path.is_file() and file_path.resolve().is_relative_to(STATIC_DIR.resolve()):
        return FileResponse(file_path)
    return FileResponse(INDEX_PATH)

@app.on_event("startup")
async def init_database() -> None:
    await init_db()
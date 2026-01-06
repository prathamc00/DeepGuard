from fastapi import FastAPI
from app.config import get_settings
from app.api.health import router as health_router
from app.api.upload import router as upload_router
from app.api.status import router as status_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(status_router)

@app.get("/")
def root():
    return {"message": "DeepGuard API running"}

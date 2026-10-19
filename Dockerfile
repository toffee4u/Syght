# ==============================================================================
# Syght — Enterprise Healthcare Fraud Detection API Dockerfile
# Optimized for Render, Google Cloud Run, and AWS ECS
# ==============================================================================

FROM python:3.11-slim

# Set environment flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    SYGHT_MODEL_PATH=models/syght_model_bundle.joblib

WORKDIR /app

# Install system dependencies needed for compiling C-extensions (LightGBM/XGBoost)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code & trained model artifacts
COPY ml_pipeline/ ./ml_pipeline/
COPY backend/ ./backend/
COPY models/ ./models/
COPY reports/ ./reports/
COPY tests/ ./tests/

# Expose API port
EXPOSE 8000

# Healthcheck verification
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start production ASGI server with Uvicorn
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT} --workers 2"]

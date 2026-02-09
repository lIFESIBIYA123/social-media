FROM python:3.10-slim

WORKDIR /app

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    jpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
    && pip install --default-timeout=100 --retries=10 --no-cache-dir -r requirements.txt

# project files
COPY . .

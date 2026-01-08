# Base image
FROM python:3.10.4-slim-bullseye

# Environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --default-timeout=100 --retries=10 -r requirements.txt

# Copy project files
COPY . .

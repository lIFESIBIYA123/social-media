# pull official base image
FROM python:3.10-alpine

# set work directory
WORKDIR /app

# set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# install psycopg2 dependencies
RUN apk update \
   && apk add --no-cache postgresql-dev gcc musl-dev jpeg-dev zlib-dev

# install python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -U setuptools \
    && pip install --default-timeout=100 --retries=10 --no-cache-dir -r requirements.txt

# copy project
COPY . .
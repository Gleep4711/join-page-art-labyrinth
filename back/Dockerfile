FROM python:3.13-slim-bookworm

WORKDIR /code

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
# COPY ./scripts ./scripts
COPY ./alembic ./alembic
COPY ./alembic.ini ./alembic.ini

RUN echo "POSTGRES_URL=$POSTGRES_URL" > .env
RUN echo "JWT_SECRET=$JWT_SECRET" >> .env

CMD alembic upgrade heads && \
    # python ./scripts/init_admin.py && \
    uvicorn app.main:app --host 0.0.0.0 --workers 4
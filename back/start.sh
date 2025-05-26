#!/bin/sh
alembic upgrade heads
exec uvicorn app.main:app --host 0.0.0.0 --workers 4
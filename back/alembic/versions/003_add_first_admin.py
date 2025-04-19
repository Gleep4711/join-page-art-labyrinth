"""add first admin user

Revision ID: 003
Revises: 002
Create Date: 2025-03-28 12:00:00.000000

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.sql import column, table
from werkzeug.security import generate_password_hash

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    users_table = table(
        'users',
        column('id', sa.Integer),
        column('username', sa.String),
        column('password_hash', sa.String),
        column('is_active', sa.Boolean),
        column('role', sa.Integer),
        column('created_at', sa.DateTime),
    )

    op.bulk_insert(users_table, [
        {
            'id': 1,
            'username': 'admin',
            'password_hash': generate_password_hash('admin123'),
            'is_active': True,
            'role': 1,  # 1 - admin
            'created_at': sa.func.now(),
        }
    ])


def downgrade() -> None:
    op.execute("DELETE FROM users WHERE username = 'admin'")

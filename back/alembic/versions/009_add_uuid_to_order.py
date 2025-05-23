"""add uuid to order

Revision ID: 009
Revises: 008
Create Date: 2025-05-16 19:00:17.247698

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '009'
down_revision: Union[str, None] = '008'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('orders', sa.Column('uuid', sa.String(), nullable=True))
    op.alter_column('orders', 'status',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.create_unique_constraint(None, 'orders', ['uuid'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'orders', type_='unique')
    op.alter_column('orders', 'status',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_column('orders', 'uuid')
    # ### end Alembic commands ###

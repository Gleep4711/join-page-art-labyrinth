"""add additional columns to participation_forms

Revision ID: 005
Revises: 004
Create Date: 2025-05-05 12:24:58.684704

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '005'
down_revision: Union[str, None] = '004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('participation_forms', sa.Column('previously_participated', sa.String(), nullable=True))
    op.add_column('participation_forms', sa.Column('additional_info', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('participation_forms', 'additional_info')
    op.drop_column('participation_forms', 'previously_participated')
    # ### end Alembic commands ###

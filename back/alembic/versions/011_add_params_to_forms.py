"""add params to forms

Revision ID: 011
Revises: 010
Create Date: 2025-05-19 22:01:32.851213

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '011'
down_revision: Union[str, None] = '010'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('participation_forms', sa.Column('conditions', sa.String(), nullable=True))
    op.add_column('participation_forms', sa.Column('experience', sa.String(), nullable=True))
    op.add_column('participation_forms', sa.Column('camping', sa.String(), nullable=True))
    op.add_column('participation_forms', sa.Column('negative', sa.String(), nullable=True))
    op.add_column('participation_forms', sa.Column('help_now', sa.Boolean(), nullable=True))
    op.add_column('participation_forms', sa.Column('inspiration', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('participation_forms', 'inspiration')
    op.drop_column('participation_forms', 'help_now')
    op.drop_column('participation_forms', 'negative')
    op.drop_column('participation_forms', 'camping')
    op.drop_column('participation_forms', 'experience')
    op.drop_column('participation_forms', 'conditions')
    # ### end Alembic commands ###

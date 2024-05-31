import { Model, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { User } from '../../user/user.model';

@Table({ tableName: 'reset_token' })
export class ResetToken extends Model<ResetToken> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_revoked',
  })
  isRevoked: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'expires_at',
  })
  expiresAt: Date;
}

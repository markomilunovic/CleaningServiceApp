import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Job } from 'modules/job/job.model';
import { User } from 'modules/user/user.model';
import { Worker } from 'modules/worker/models/worker.model';

@Table({ tableName: 'transaction' })
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Job)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'job_id',
  })
  jobId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @ForeignKey(() => Worker)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'worker_id',
  })
  workerId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM,
    values: ['pending', 'completed'],
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

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
}

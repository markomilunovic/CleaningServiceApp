import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from 'modules/user/models/user.model';
import { Worker } from 'modules/worker/models/worker.model';

@Table({ tableName: 'job' })
export class Job extends Model<Job> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'user_id',
  })
  userId: number;

  @ForeignKey(() => Worker)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'worker_id',
  })
  workerId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'square_meters',
  })
  squareMeters: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  rooms: object;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  tasks: object;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'hourly_rate',
  })
  hourlyRate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'total_value',
  })
  totalValue: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'contact_person',
  })
  contactPerson: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'contact_phone',
  })
  contactPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  municipality: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  approvedByAdmin: boolean;

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
    type: DataType.ENUM,
    values: ['pending', 'accepted', 'completed'],
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;
}

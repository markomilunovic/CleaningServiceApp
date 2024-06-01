import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'user' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'building_number',
  })
  buildingNumber: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  floor: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'apartment_number',
  })
  apartmentNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'contact_phone',
  })
  contactPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: ['user', 'admin'],
    allowNull: false,
    defaultValue: 'user',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'email_verified',
  })
  emailVerified: boolean;

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
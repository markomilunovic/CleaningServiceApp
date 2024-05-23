import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'worker' })
export class Worker extends Model<Worker> {
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
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'id_card_photo_front_url',
  })
  idCardPhotoFrontUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'id_card_photo_back_url',
  })
  idCardPhotoBackUrl: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hourlyRate: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  cities: object;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  municipalities: object;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  emailVerified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  termsAccepted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'verified_by_admin',
  })
  verifiedByAdmin: boolean;

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

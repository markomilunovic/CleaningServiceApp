import { Column, Model, DataType, Table } from "sequelize-typescript";

@Table({ tableName: 'message' })
export class Message extends Model<Message> {
    @Column({
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        field: 'sender_id'
    })
    sender_id: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        field: 'receiver_id'
    })
    receiver_id: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        field: 'job_id'
    })
    job_id: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
        field: 'content'
    })
    content: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'created_at'
      })
      createdAt: Date;
    
      @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'updated_at'
      })
      updatedAt: Date;
};

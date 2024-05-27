import { Job } from "modules/job/job.model";
import { User } from "modules/user/user.model";
import { Worker } from "modules/worker/worker.model";
import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";

@Table({ tableName: 'message' })
export class Message extends Model<Message> {
    @Column({
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'sender_id'
    })
    sender_id: number;

    @ForeignKey(() => Worker)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'receiver_id'
    })
    receiver_id: number;

    @ForeignKey(() => Job)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'job_id'
    })
    job_id: number;

    @Column({
        type: DataType.STRING,
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

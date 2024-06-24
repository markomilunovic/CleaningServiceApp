import { Job } from "modules/job/job.model";
import { User } from "modules/user/models/user.model";
import { Worker } from "modules/worker/models/worker.model";
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
    senderId: number;

    @Column({
        type: DataType.ENUM('user', 'worker'),
        allowNull: false,
        field: 'sender_type'
    })
    senderType: 'user' | 'worker';

    @ForeignKey(() => Worker)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'receiver_id'
    })
    receiverId: number;

    @Column({
        type: DataType.ENUM('user', 'worker'),
        allowNull: false,
        field: 'receiver_type'
    })
    receiverType: 'user' | 'worker';

    @ForeignKey(() => Job)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'job_id'
    })
    jobId: number;

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

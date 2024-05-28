import { Model, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { User } from "../../user/user.model";
import { Worker } from "modules/worker/worker.model";

@Table({ tableName: 'reset_token' })
export class ResetToken extends Model<ResetToken> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id'
    })
    user_id: number;

    @ForeignKey(() => Worker)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'worker_id'
    })
    worker_id: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_revoked'
    })
    is_revoked: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'expires_at'
    })
    expires_at: Date;
};
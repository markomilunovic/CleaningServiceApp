import { Model, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { User } from "modules/user/user.model";
import { Worker } from "modules/worker/worker.model";

@Table({ tableName: 'access_token' })
export class AccessToken extends Model<AccessToken> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'user_id'
    })
    user_id: number;

    @ForeignKey(() => Worker)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
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
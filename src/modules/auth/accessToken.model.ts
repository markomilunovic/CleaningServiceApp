import { UUID } from "crypto";
import { Model, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { User } from "../user/user.model";

@Table({ tableName: 'access_token' })
export class AccessToken extends Model<AccessToken> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id: UUID;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id'
    })
    user_id: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        field: 'is_revoked'
    })
    is_revoked: boolean;
    
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'created_at'
    })
    created_at: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'updated_at'
    })
    updated_at: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'expires_at'
    })
    expires_at: Date;
};
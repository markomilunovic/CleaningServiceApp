import { Model, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { AccessToken } from "./accessToken.model";

@Table({ tableName: 'refresh_token' })
export class RefreshToken extends Model<RefreshToken> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @ForeignKey(() => AccessToken)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'access_token_id'
    })
    access_token_id: string;

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
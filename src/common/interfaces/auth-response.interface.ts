import { User } from "modules/user/models/user.model";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
    user: User;
}

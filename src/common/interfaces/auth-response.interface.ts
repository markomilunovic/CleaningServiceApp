import { User } from "modules/user/user.model";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
    user: User;
}

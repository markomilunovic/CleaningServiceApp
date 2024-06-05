import { AuthResponse } from 'common/interfaces/auth-response.interface';
import { UserResponseDto } from 'modules/user/dtos/user-response.dto';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  user: UserResponseDto;

  constructor(authResponse: AuthResponse) {
    this.accessToken = authResponse.accessToken;
    this.refreshToken = authResponse.refreshToken;
    this.accessTokenExpiresAt = authResponse.accessTokenExpiresAt;
    this.refreshTokenExpiresAt = authResponse.refreshTokenExpiresAt;
    this.user = new UserResponseDto(authResponse.user);
  }
}

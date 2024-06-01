import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthUserService } from '../../services/auth-user.service';

@Injectable()
export class GoogleUserStrategy extends PassportStrategy(Strategy, 'google-user') {
  constructor(
    private readonly authUserService: AuthUserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_USER_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;

    if (!emails || emails.length === 0) {
      return done(new Error('No email found in the user profile'), false);
    }

    const email = emails[0].value;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';

    try {
      const user = await this.authUserService.registerOrLoginOauth2(email, firstName, lastName);
      done(null, user);
    } catch (error) {
      console.error('Error validating user:', error);
      done(error, false);
    }
  }
}

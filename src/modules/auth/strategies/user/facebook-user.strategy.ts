import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthUserService } from '../../services/auth-user.service'; 
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookUserStrategy extends PassportStrategy(Strategy, 'facebook-user') {
  constructor(
    private readonly authUserService: AuthUserService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK__USER_CALLBACK_URL'),
      profileFields: ['emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { name, emails } = profile;

    if (!emails || emails.length === 0) {
      try {
        const user = await this.authUserService.registerOrLoginOauth2('', name.givenName, name.familyName);
        return done(null, user);
      } catch (error) {
        console.error('Error validating user:', error);
        return done(error, false);
      }
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

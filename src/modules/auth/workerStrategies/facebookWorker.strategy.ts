import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthWorkerService } from '../services/authWorker.service';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class FacebookWorkerStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authWorkerService: AuthWorkerService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      profileFields: ['id', 'emails', 'name'], // Request the necessary profile fields
      scope: ['email'], // Request email permission
    });
  };

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {

    const { name, emails } = profile;

    if (!emails || emails.length === 0) {
      return done(new Error('No email found in the worker profile'), false);
    };

    const email = emails[0].value;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';

    try {
      const worker = await this.authWorkerService.registerOrLoginOauth2(email, firstName, lastName); 
      done(null, worker);
    } catch (error) {
      done(error, false);
    };
  };
};

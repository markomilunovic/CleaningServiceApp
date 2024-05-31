import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthWorkerService } from '../services/authWorker.service';

@Injectable()
export class GoogleWorkerStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authWorkerService: AuthWorkerService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  };

  async validate(profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;

    if (!emails || emails.length === 0) {
      return done(new Error('No email found in the user profile'), false);
    };

    const email = emails[0].value;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';

    try {
      const worker = await this.authWorkerService.registerOrLoginWithGoogle(email, firstName, lastName);
      done(null, worker);
    } catch (error) {
      done(error, false);
    };
  };
};

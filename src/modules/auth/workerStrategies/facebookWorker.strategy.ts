import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-facebook';
import { AuthWorkerService } from '../services/authWorker.service';

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
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;

    // Ensure emails array is defined and has at least one element
    if (!emails || emails.length === 0) {
      return done(new Error('No email found in the user profile'), false);
    }

    const email = emails[0].value;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';

    try {
      const worker = await this.authWorkerService.registerOrLoginWithGoogle(email, firstName, lastName); // Reuse the same method
      done(null, worker);
    } catch (error) {
      done(error, false);
    }
  }
}

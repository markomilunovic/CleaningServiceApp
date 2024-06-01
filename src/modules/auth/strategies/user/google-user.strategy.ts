import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserRepository } from 'modules/user/user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleUserStrategy extends PassportStrategy(Strategy, 'google-user') {
    constructor(
        private readonly userRepository: UserRepository,
        configService: ConfigService,
    ) {
        super({
          clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
          clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
          callbackURL: configService.get<string>('GOOGLE_USER_CALLBACK_URL'),
          scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        const { name, emails } = profile;
        let user = await this.userRepository.findUserByEmail(emails[0].value);
    
        if (!user) {
            user = await this.userRepository.createUser({
                firstName: name.givenName,
                lastName: name.familyName,
                email: emails[0].value,
                password: '',
                address: '',
                buildingNumber: 0,
                floor: 0,
                apartmentNumber: '',
                city: '',
                contactPhone: '',
            });
        }
    
        done(null, user);
    }
}
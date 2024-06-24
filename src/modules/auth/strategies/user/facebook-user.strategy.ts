import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UserRepository } from 'modules/user/repositories/user.repository'; 
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class FacebookUserStrategy extends PassportStrategy(Strategy, 'facebook-user') {
    constructor(
        private readonly userRepository: UserRepository,
        configService: ConfigService,
    ) {
        super({
          clientID: configService.get<string>('FACEBOOK_APP_ID'),
          clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
          callbackURL: configService.get<string>('FACEBOOK_USER_CALLBACK_URL'),
          profileFields: ['emails', 'name'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        const { name, emails } = profile;
    
        const user = await this.userRepository.findUserByEmail(emails[0].value);
    
        if (!user) {

            const newUser = await this.userRepository.createUser({
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
            return done(null, newUser);
        }
    
        done(null, user);
    }
}
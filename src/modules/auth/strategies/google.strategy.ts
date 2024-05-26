import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from 'modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly userService: UserService,
        configService: ConfigService,
    ) {
        super({
          clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
          clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
          callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
          scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        console.log('Google profile:', profile);
        const { name, emails } = profile;
        let user = await this.userService.findUserByEmail(emails[0].value);
    
        if (!user) {
            user = await this.userService.registerUser({
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

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { UserService } from 'modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private readonly userService: UserService,
        configService: ConfigService,
    ) {
        super({
          clientID: configService.get<string>('FACEBOOK_APP_ID'),
          clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
          callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
          profileFields: ['emails', 'name'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { name, emails } = profile;
        
        if (!emails || !emails.length) {
            const user = await this.userService.registerUser({
                firstName: name.givenName,
                lastName: name.familyName,
                email: '',
                password: '',
                address: '',
                buildingNumber: 0,
                floor: 0,
                apartmentNumber: '',
                city: '',
                contactPhone: '',
            });
    
            return done(null, user);
        }
    
        const user = await this.userService.findUserByEmail(emails[0].value);
    
        if (!user) {

            const newUser = await this.userService.registerUser({
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

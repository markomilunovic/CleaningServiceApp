import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.get<string>('KEY_SECRET'), 
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Define serialize and deserialize functions
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

=======
  app.useGlobalPipes(new ValidationPipe());
>>>>>>> develop
  await app.listen(3000);
}
bootstrap();

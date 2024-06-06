import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Worker } from 'modules/worker/models/worker.model';
import { AuthWorkerRepository } from 'modules/auth/repositories/auth-worker.repository';
import { JwtPayloadType } from 'modules/auth/utils/worker-types';

@Injectable()
export class JwtWorkerStrategy extends PassportStrategy(Strategy, 'jwt-worker') {
  constructor(
    private readonly configService: ConfigService,
    private authWorkerRepository: AuthWorkerRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  };

  async validate(payload: JwtPayloadType): Promise<Worker> {

    const worker = await this.authWorkerRepository.findWorkerById(payload.accessTokenEncode.sub);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    };

    return worker;

  };
};

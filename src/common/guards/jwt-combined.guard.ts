import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCombinedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userAuthGuard = new (AuthGuard('jwt-user'))();
    const workerAuthGuard = new (AuthGuard('jwt-worker'))();

    try {
      await userAuthGuard.canActivate(context);
      const user = request.user;
      user['userType'] = 'user';
      return true;
    } catch (err) {};

    try {
      await workerAuthGuard.canActivate(context);
      const worker = request.user;
      worker['userType'] = 'worker';
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    };
  };
};

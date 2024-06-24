import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "common/utils/types";
import { User } from "modules/user/models/user.model";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    };

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !requiredRoles.some(role => user.role === role)) {
      throw new UnauthorizedException('You do not have the necessary permissions (admin role) to access this resource.');
    };

    return requiredRoles.some((role) => user.role.includes(role));
  };
};


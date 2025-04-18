import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEYS } from "src/common/decorators/roles.decorator";
import { UserType } from "src/modules/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}
     canActivate(context: ExecutionContext):any{
        const requiredRoles = this.reflector.getAllAndOverride<UserType>(ROLES_KEYS,[
            context.getHandler(),
            context.getClass(),
        ])
        if(!requiredRoles){
            return true;
        }
        const {user} = context.switchToHttp().getRequest();

        return requiredRoles==user.userType;
        
     }
}
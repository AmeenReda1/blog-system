import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/modules/user/entities/user.entity";

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEYS, roles);
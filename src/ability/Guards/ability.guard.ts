import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AbilityBuilder,
  PureAbility,
  ExtractSubjectType,
  InferSubjects
} from '@casl/ability';
import { User } from 'src/user/entities/user.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Repository } from 'typeorm';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ   = 'read',
}

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;


// map DB subject names to class constructors
const subjectsMap: Record<string, typeof User> = {
  User,
  // add other entities here: Post, Article, etc.
};

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly userRepo: Repository<User>,
    private readonly rolePermRepo: Repository<RolePermission>,
  ) {}

  async defineAbilityFor(userId: string): Promise<AppAbility> {
    // 1) Load user with role and permissions
    const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['role', 'role.permissions', 'role.permissions.permission'],
    });
    if(!user) {
      throw new NotFoundException('the user is not found');
    }
    
    const perms = user.role.permissions.map(rp => rp.permission);

    // 2) Build CASL rules
    const builder = new AbilityBuilder<AppAbility>(PureAbility);
    const { can, cannot, build } = builder;

    for (const perm of perms) {
          // determine subject type
          const subject = perm.subject === 'all'
            ? 'all'
            : subjectsMap[perm.subject];

          if (!subject) continue; // skip unknown subjects

          can(
            perm.action as Action,
            subject,
            perm.condition || undefined,
          );
        }

    // 3) Return built ability
    return build({
      detectSubjectType: item =>
        (item as any).constructor as ExtractSubjectType<Subjects>,
    });
  }
}


// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { AbilityFactory } from "../ability.factory/ability.factory";
// import { Observable } from "rxjs";
// import { CHECK_ABILITY, RequiredRule } from "../decorators/ability.decorator";
// import { User } from "src/user/entities/user.entity";
// import { Role } from "src/user/enum/role.enum";
// import { ForbiddenError } from "@casl/ability";

// @Injectable()
// export class AbilityGuard implements CanActivate {
//     constructor(
//         private readonly reflector: Reflector,
//         private readonly caslAbilityFactory: AbilityFactory
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

//         const user: User = { 
//             id: '',
//             role: Role.ADMIN
//         }

//         const ability = this.caslAbilityFactory.defineAbility(user);

//         try {
//             rules.forEach((rule) => ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject));

//             return true;
//         } catch(err) {
//             if(err instanceof ForbiddenError) {
//                 throw new ForbiddenException(err.message);
//             }
//             return false;
//         }
//     }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AbilityBuilder,
  PureAbility,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { RolePermission } from '../entities/role-permission.entity';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ   = 'read',
}

// Subjects must be entity constructors or the string 'all'
export type Subjects = typeof User | 'all';
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
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions', 'role.permissions.permission'],
    });
    if (!user) throw new NotFoundException('User not found');

    const perms = user.role.permissions.map(rp => rp.permission);

    const { can, cannot, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(PureAbility);

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

    return build({
      detectSubjectType: item =>
        (item as any).constructor as ExtractSubjectType<Subjects>,
    });
  }
}
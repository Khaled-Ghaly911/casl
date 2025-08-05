import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AdminService } from './ability.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { User } from 'src/user/entities/user.entity';

@Resolver()
export class AbilityResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => Role)
  createRole(@Args('name') name: string) {
    return this.adminService.createRole(name);
  }

  @Mutation(() => Permission)
  createPermission(
    @Args('action') action: string,
    @Args('subject') subject: string,
    @Args('condition', { nullable: true }) condition: string,
  ) {
    return this.adminService.createPermission(action, subject, condition ? JSON.parse(condition) : undefined);
  }

  @Mutation(() => RolePermission)
  assignPermission(
    @Args('roleId') roleId: string,
    @Args('permissionId') permissionId: string,
  ) {
    return this.adminService.assignPermissionToRole(roleId, permissionId);
  }

  @Mutation(() => User)
  async assignRole(
    @Args('userId') userId: string,
    @Args('roleName') roleName: string
  ): Promise<User> {
    return this.adminService.assignRole(userId, roleName)
  }

  @Query(() => [Role])
  getRoles() {
    return this.adminService.getRoles();
  }

  @Query(() => [Permission])
  getPermissions() {
    return this.adminService.getPermissions();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,

    @InjectRepository(RolePermission)
    private rolePermRepo: Repository<RolePermission>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async createRole(name: string): Promise<Role> {
    const role = this.roleRepo.create({ name });
    return this.roleRepo.save(role);
  }

  async createPermission(action: string, subject: string, condition?: any): Promise<Permission> {
    const permission = this.permissionRepo.create({ action, subject, condition });
    return this.permissionRepo.save(permission);
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
    const rolePermission = this.rolePermRepo.create({ roleId, permissionId });
    return this.rolePermRepo.save(rolePermission);
  }

  async getRoles(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ['permissions', 'permissions.permission'] });
  }

  async getPermissions(): Promise<Permission[]> {
    return this.permissionRepo.find();
  }

    async assignRole(
        userId: string,
        roleName: string,
    ): Promise<User> {
        const user = await this.userRepo.findOneBy({ id: userId });
        const role = await this.roleRepo.findOneBy({ name: roleName });

        if (!user || !role) throw new Error('User or role not found');

        user.role = role;
        return await this.userRepo.save(user);
    }
}
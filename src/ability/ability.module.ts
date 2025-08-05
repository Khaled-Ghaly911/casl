import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory/ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserModule } from 'src/user/user.module';
import { AbilityResolver } from './ability.resolver';
import { AdminService } from './ability.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Permission, RolePermission])
    ],
    providers: [AbilityFactory, AdminService, AbilityResolver],
    exports: [AbilityFactory, AbilityResolver]
})
export class AbilityModule {}

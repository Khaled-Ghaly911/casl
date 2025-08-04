import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory/ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, Permission, RolePermission])
    ],
    providers: [AbilityFactory],
    exports: [AbilityFactory]
})
export class AbilityModule {}

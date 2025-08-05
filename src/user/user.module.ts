import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AbilityModule } from 'src/ability/ability.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolePermission } from 'src/ability/entities/role-permission.entity';
import { Permission } from 'src/ability/entities/permission.entity';
import { Role } from 'src/ability/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, RolePermission]),
    AbilityModule, 
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}

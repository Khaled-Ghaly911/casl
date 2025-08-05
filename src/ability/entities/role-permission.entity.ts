import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Role, role => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  @Field()
  roleId: string;

  @ManyToOne(() => Permission, perm => perm.rolePermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column()
  @Field()
  permissionId: string;
}
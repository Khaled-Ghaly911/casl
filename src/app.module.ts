import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { User } from './user/entities/user.entity';
import { Role } from './ability/entities/role.entity';
import { Permission } from './ability/entities/permission.entity';
import { RolePermission } from './ability/entities/role-permission.entity';
import { AbilityFactory } from './ability/ability.factory/ability.factory';
import { PoliciesGuard } from './ability/Guards/policies.guard';
import { ApolloDriver } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AbilityModule } from './ability/ability.module';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'casl',
      entities: [User, Role, Permission, RolePermission],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ user: req.user }),
    }),
    UserModule,
    AbilityModule,
  ],
  providers: [
    AbilityFactory, 
    PoliciesGuard,
      {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AbilityModule } from 'src/ability/ability.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AbilityModule, 
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Role } from 'src/ability/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const defaultRole = await this.roleRepo.findOne({ where: { name: 'user' }});
    if(!defaultRole) throw new NotFoundException("Default role not found!")
    const user = this.userRepo.create({
      role: defaultRole,
      ...createUserInput
    });
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserInput);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}

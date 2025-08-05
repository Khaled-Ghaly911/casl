import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AbilityFactory, Action } from 'src/ability/ability.factory/ability.factory';
import { CheckPolicies } from 'src/ability/decorators/check-policies.decorator';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from 'src/ability/Guards/policies.guard';

@Resolver(() => User)
export class UserResolver {
    constructor(
      private readonly userService: UserService,
      private readonly abilityFactory: AbilityFactory
    ) {}

    // @UseGuards(PoliciesGuard)
    // @CheckPolicies((ability) => ability.can(Action.CREATE, User))
    @Mutation(() => User)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
        return await this.userService.create(createUserInput);
    }

    // @UseGuards(PoliciesGuard)
    // @CheckPolicies((ability) => ability.can(Action.READ, User))
    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.userService.findAll();
    }

    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability) => ability.can(Action.READ, User))
    @Query(() => User, { name: 'user' })
    findOne(@Args('id') id: string) {
        return this.userService.findOne(id);
    }

    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability) => ability.can(Action.UPDATE, User))
    @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.update(updateUserInput.id, updateUserInput);
    }

    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability) => ability.can(Action.DELETE, User))
    @Mutation(() => User)
    removeUser(@Args('id') id: string) {
        return this.userService.remove(id);
    }
}

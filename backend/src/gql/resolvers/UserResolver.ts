import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Int,
  InputType,
  Field,
} from 'type-graphql';
import { User } from '../../models/User'; // Temoirary name to avoid conflict with User from type-graphql
import { UserType } from '../types/User';
import { Context } from '../../context';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@InputType()
class UserCreateInput {
  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  homeAddress: string;
}

@Resolver(UserType)
export class UserResolver {
  @Query(() => UserType)
  async getUser(@Arg('id') data: String, @Ctx() ctx: Context) {
    return ctx.models.users.findById(data);
  }

  @Query(() => [UserType])
  async getAllUsers(@Ctx() ctx: Context) {
    return ctx.models.users.find();
  }

  @Mutation((returns) => UserType)
  async createUser(
    @Arg('data') data: UserCreateInput,
    @Ctx() ctx: Context,
  ): Promise<User> {
    return await ctx.models.users.create({
      ...data,
    });
  }
}

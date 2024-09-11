import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@ObjectType()
export class UserType {
  @Field((type) => ID)
  _id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  first_name?: string | null;

  @Field((type) => String, { nullable: true })
  last_name?: string | null;

  @IsPhoneNumber()
  @Field((type) => String, { nullable: true })
  phone?: string | null;

  @Field((type) => String, { nullable: true })
  home_address?: string | null;
}

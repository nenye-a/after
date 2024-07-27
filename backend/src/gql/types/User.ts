import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@ObjectType()
export class UserType {
  @Field((type) => ID)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  firstName?: string | null;

  @Field((type) => String, { nullable: true })
  lastName?: string | null;

  @IsPhoneNumber()
  @Field((type) => String, { nullable: true })
  phone?: string | null;

  @Field((type) => String, { nullable: true })
  homeAddress?: string | null;
}

import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class OutingType {
  @Field((type) => ID)
  _id: string;

  @Field((type) => String)
  user_id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  status: string;

  @Field((type) => Date)
  start_date: Date;

  @Field((type) => Date, { nullable: true })
  end_date?: Date;

  @Field((type) => String, { nullable: true })
  linked_outing_id?: string;

  @Field((type) => Boolean, { nullable: true })
  favorite?: boolean;

  @Field((type) => Boolean, { nullable: true })
  automatically_ended?: boolean;

  @Field((type) => String, { nullable: true })
  city?: string;

  @Field((type) => Number, { nullable: true })
  num_locations?: number;

  @Field((type) => Number, { nullable: true })
  num_participants?: number;

  @Field((type) => [String], { nullable: true })
  images?: string[];
}

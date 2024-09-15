import 'reflect-metadata';
import { ObjectType, Field } from 'type-graphql';
import { OutingType } from './Outing';
import { LocationType } from './Location';

@ObjectType()
export class OutingAndLocationType {
  @Field(() => OutingType)
  outing: OutingType;

  @Field(() => LocationType, { nullable: true })
  location: LocationType;
}

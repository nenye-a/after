import 'reflect-metadata';
import { ObjectType, Field, ID, InputType } from 'type-graphql';

@InputType()
export class CoordinatesInput {
  @Field((type) => Number)
  latitude: number;

  @Field((type) => Number)
  longitude: number;
}

@ObjectType()
export class CoordinatesType {
  @Field((type) => Number)
  latitude: number;

  @Field((type) => Number)
  longitude: number;
}

@InputType()
export class PathInput {
  @Field((type) => CoordinatesInput)
  coordinates: CoordinatesInput;

  @Field((type) => Date)
  time: Date;
}

@ObjectType()
export class PathType {
  @Field((type) => ID)
  _id: string;

  @Field((type) => ID)
  user_id: string;

  @Field((type) => CoordinatesType)
  coordinates: CoordinatesType;

  @Field((type) => ID)
  outing_id: string;

  @Field((type) => Date)
  time: Date;

  @Field((type) => String, { nullable: true })
  linked_outing_id?: string;

  @Field((type) => ID, { nullable: true })
  location_id?: string;
}

@ObjectType()
export class OutingPathType {
  @Field((type) => ID)
  outing_id: string;

  @Field((type) => [PathType])
  points: PathType[];
}

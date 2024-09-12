import 'reflect-metadata';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { CoordinatesType } from './Path';
import { PriceLevel } from '../../engine/types';

registerEnumType(PriceLevel, {
  name: 'PriceLevel',
  description: 'Price level of a location',
});

@ObjectType()
export class LocationInfo {
  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  rating?: number;

  @Field({ nullable: true })
  num_ratings?: number;

  @Field((type) => PriceLevel, { nullable: true })
  price_level?: PriceLevel;

  @Field((type) => [String], { nullable: true })
  image_urls?: string[];

  @Field((type) => [String], { nullable: true })
  google_photo_names?: string[];

  @Field((type) => [String], { nullable: true })
  tags?: string[];
}

@ObjectType()
export class LocationExternalIds {
  @Field({ nullable: true })
  google_place_id?: string;

  @Field({ nullable: true })
  yelp_id?: string;

  @Field({ nullable: true })
  here_id?: string;
}

@ObjectType()
export class LocationType {
  @Field((type) => ID)
  _id: string;

  @Field((type) => ID)
  user_id: string;

  @Field((type) => ID)
  outing_id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field((type) => CoordinatesType)
  coordinates: CoordinatesType;

  @Field({ nullable: true })
  city?: string;

  @Field()
  start_time: Date;

  @Field({ nullable: true })
  end_time?: Date;

  @Field((type) => LocationInfo, { defaultValue: {} })
  info: LocationInfo;

  @Field((type) => LocationExternalIds, { defaultValue: {} })
  external_ids: LocationExternalIds;

  @Field((type) => ID, { nullable: true })
  recommendation_id?: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  favorite?: boolean;
}

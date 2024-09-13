import { OutingType } from '@/services/graphql/after/generated/graphql';

export type ActiveOutingSummary = Pick<
  OutingType,
  '_id' | 'name' | 'start_date' | 'end_date' | 'status' | 'linked_outing_id'
>;

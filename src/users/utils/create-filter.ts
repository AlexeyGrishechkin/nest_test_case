import { QueryParams } from '../types/query.types';
import { FilterTypes } from '../types/filter.types';

export function createFilter(query: QueryParams): FilterTypes {
  const filter: FilterTypes = {};

  if (query.name) filter.name = query.name;
  if (query.email) filter.email = query.email;
  if (query.age) filter.age = parseInt(query.age, 10);

  return filter;
}

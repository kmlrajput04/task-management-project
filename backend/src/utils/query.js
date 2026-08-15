import { getPaginationParams } from './pagination.js';
import { parseSearchTerm } from './search.js';
import { parseSortParams } from './sort.js';

export const parseQueryParams = (query = {}, allowedSortFields = ['createdAt']) => {
  const { page, limit, skip } = getPaginationParams(query);
  const search = parseSearchTerm(query.search);
  const { sortBy, sortOrder } = parseSortParams(query.sort, query.order, allowedSortFields);

  return {
    page,
    limit,
    skip,
    search,
    sortBy,
    sortOrder
  };
};
export default parseQueryParams;

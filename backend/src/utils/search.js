export const parseSearchTerm = (search) => {
  if (typeof search !== 'string') return '';
  return search.trim();
};

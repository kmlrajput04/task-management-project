export const parseSortParams = (sortBy, sortOrder, allowedFields = ['createdAt']) => {
  const field = allowedFields.includes(sortBy) ? sortBy : allowedFields[0] || 'createdAt';
  const order = sortOrder && sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { sortBy: field, sortOrder: order };
};
export default parseSortParams;

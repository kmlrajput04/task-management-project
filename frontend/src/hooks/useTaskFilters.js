import { useSearchParams } from 'react-router-dom';

export const useTaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    assignee: searchParams.get('assignee') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc'
  };

  const setFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, String(value));
      }
    });

    // Reset page to 1 if modifying filtering columns (status, priority, search, assignee, limit)
    const filtersMismatched = Object.keys(newFilters).some(k =>
      ['status', 'priority', 'search', 'assignee', 'limit'].includes(k)
    );
    
    if (filtersMismatched && !newFilters.page) {
      updatedParams.set('page', '1');
    }

    setSearchParams(updatedParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    setFilters,
    resetFilters
  };
};

export default useTaskFilters;

import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useTasks = (filters = {}) => {
  const query = useQuery({
    queryKey: ['tasks-list', filters],
    queryFn: async () => {
      // API call takes search parameters mapped exactly to params keys
      const res = await taskService.getAllTasks(filters);
      return res; // returns standardized pagination response envelope
    },
    keepPreviousData: true
  });

  return {
    data: query.data?.data || [],
    meta: query.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading: query.isLoading || query.isFetching,
    error: query.error,
    refetch: query.refetch
  };
};

export default useTasks;

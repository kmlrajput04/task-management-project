import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useTask = (id) => {
  const query = useQuery({
    queryKey: ['task-details', id],
    queryFn: async () => {
      const res = await taskService.getTaskById(id);
      return res.data; // returns single task detail object
    },
    enabled: !!id
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useTask;

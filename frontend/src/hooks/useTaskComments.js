import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useTaskComments = (taskId) => {
  const query = useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async () => {
      const res = await taskService.getTaskComments(taskId);
      return res.data; // returns array of task comments
    },
    enabled: !!taskId
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useTaskComments;

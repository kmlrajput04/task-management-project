import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useTaskActivity = (taskId) => {
  const query = useQuery({
    queryKey: ['task-activity', taskId],
    queryFn: async () => {
      const res = await taskService.getTaskActivity(taskId);
      return res.data; // returns array of activity logs
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

export default useTaskActivity;

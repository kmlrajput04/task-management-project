import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';
import { fetchNotificationsAsync } from '../store/slices/notificationsSlice';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (taskData) => {
      const res = await taskService.createTask(taskData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      dispatch(fetchNotificationsAsync());
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create task');
    }
  });
};

export default useCreateTask;

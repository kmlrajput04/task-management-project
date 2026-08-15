import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';
import { fetchNotificationsAsync } from '../store/slices/notificationsSlice';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await taskService.updateTask(id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;
      toast.success('Task updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      queryClient.invalidateQueries({ queryKey: ['task-details', id] });
      dispatch(fetchNotificationsAsync());
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update task');
    }
  });
};

export default useUpdateTask;

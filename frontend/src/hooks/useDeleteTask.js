import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await taskService.deleteTask(id);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      navigate('/tasks');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete task');
    }
  });
};

export default useDeleteTask;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { taskService } from '../services/task.service';
import { toast } from 'sonner';
import { fetchNotificationsAsync } from '../store/slices/notificationsSlice';

export const useCreateComment = (taskId) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (commentData) => {
      const res = await taskService.addTaskComment(taskId, commentData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Comment posted successfully');
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-activity', taskId] });
      dispatch(fetchNotificationsAsync());
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to post comment');
    }
  });
};

export default useCreateComment;

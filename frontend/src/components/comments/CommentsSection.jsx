import React from 'react';
import { Card } from '../ui';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import useTaskComments from '../../hooks/useTaskComments';
import useCreateComment from '../../hooks/useCreateComment';

export const CommentsSection = ({ taskId }) => {
  const { data: comments, isLoading } = useTaskComments(taskId);
  const { mutateAsync: createComment, isPending } = useCreateComment(taskId);

  const handlePostComment = async (data) => {
    await createComment(data);
  };

  return (
    <Card title={`Comments (${comments.length})`} padding="md" className="space-y-6">
      <CommentForm onSubmit={handlePostComment} loading={isPending} />
      <div className="pt-4 border-t border-slate-800/80">
        <CommentList comments={comments} loading={isLoading} />
      </div>
    </Card>
  );
};

export default CommentsSection;

import React from 'react';
import CommentItem from './CommentItem';
import { EmptyState } from '../ui';

export const CommentList = ({ comments = [] }) => {
  if (comments.length === 0) {
    return (
      <EmptyState
        iconName="MessageSquare"
        title="No comments yet"
        description="Share updates, raise concerns, or coordinate tasks by posting comments."
      />
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;

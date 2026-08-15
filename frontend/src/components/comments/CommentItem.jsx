import React from 'react';
import { Avatar } from '../ui';
import { formatRelativeDate } from '../../utils/date';

export const CommentItem = ({ comment }) => {
  return (
    <div className="flex gap-4 items-start pb-4 border-b border-slate-800/40 last:border-0 last:pb-0 animate-fade-in">
      <Avatar size="sm" src={comment.user?.avatar} name={comment.user?.name || 'User'} />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-350">{comment.user?.name || 'Collaborator'}</span>
          <span className="text-[10px] text-slate-500 font-medium">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">
          {comment.comment}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;

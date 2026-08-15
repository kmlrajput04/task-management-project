import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea, Button } from '../ui';
import useAuth from '../../hooks/useAuth';

const commentValidationSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty').trim()
});

export const CommentForm = ({ onSubmit, loading = false }) => {
  const [generalError, setGeneralError] = useState('');
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(commentValidationSchema)
  });

  const handleFormSubmit = async (data) => {
    try {
      setGeneralError('');
      if (!currentUser) {
        throw new Error('You must be logged in to add comments');
      }

      await onSubmit({
        comment: data.comment,
        userId: currentUser.id
      });
      reset();
    } catch (err) {
      setGeneralError(err.message || 'An error occurred while posting comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <Textarea
        placeholder="Add a comment to this task..."
        rows={3}
        disabled={loading}
        error={errors.comment?.message}
        {...register('comment')}
      />

      {generalError && (
        <p className="text-xs text-red-500 font-semibold">{generalError}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" loading={loading}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;

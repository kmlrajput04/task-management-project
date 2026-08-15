import React from 'react';
import { Button } from '../ui';

export const TaskFormActions = ({ mode = 'create', onCancel, loading = false, generalError }) => {
  return (
    <div className="space-y-4">
      {generalError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg font-medium">
          {generalError}
        </div>
      )}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {mode === 'create' ? 'Save Task' : 'Update Task'}
        </Button>
      </div>
    </div>
  );
};

export default TaskFormActions;

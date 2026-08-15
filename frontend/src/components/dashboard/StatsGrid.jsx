import React from 'react';
import { LayoutGrid, ClipboardList, Clock, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';
import StatsCard from './StatsCard';

export const StatsGrid = ({ summary, loading = false, role }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: summary?.totalTasks ?? 0,
      icon: ClipboardList,
      color: 'blue'
    },
    {
      title: 'Pending',
      value: summary?.pendingTasks ?? 0,
      icon: Clock,
      color: 'slate'
    },
    {
      title: 'In Progress',
      value: summary?.inProgressTasks ?? 0,
      icon: LayoutGrid,
      color: 'indigo'
    },
    {
      title: 'Completed',
      value: summary?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: 'green'
    },
    {
      title: 'Overdue',
      value: summary?.overdueTasks ?? 0,
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'My Tasks',
      value: summary?.myTasks ?? 0,
      icon: UserCheck,
      color: 'yellow'
    }
  ];

  const filteredCards = role === 'ADMIN' ? cards.slice(0, 5) : cards;
  const gridCols = role === 'ADMIN' ? 'lg:grid-cols-5' : 'lg:grid-cols-6';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-4 mb-6`}>
      {filteredCards.map((card, idx) => (
        <StatsCard
          key={idx}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default StatsGrid;

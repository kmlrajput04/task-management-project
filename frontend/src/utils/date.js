import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, differenceInDays } from 'date-fns';

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';

  const diffDays = Math.abs(differenceInDays(Date.now(), date));
  if (diffDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, 'MMM dd');
};

export default formatRelativeDate;

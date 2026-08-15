import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import useAuth from './useAuth';

export const useDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;

  // Query dashboard analytics
  const dashboardQuery = useQuery({
    queryKey: ['dashboard-data', userId],
    queryFn: async () => {
      const res = await dashboardService.getDashboard(userId);
      return res.data; // Renders backend's standardized response payload
    },
    enabled: !!userId // Wait until authenticated user ID is available
  });

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch
  };
};

export default useDashboard;

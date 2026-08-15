import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/task.service';

export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await taskService.getAllTasks(filters);
      return response.data; // response shape is successResponse/paginationResponse
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc'
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  }
});

export const { setFilter, resetFilters } = tasksSlice.actions;
export default tasksSlice.reducer;

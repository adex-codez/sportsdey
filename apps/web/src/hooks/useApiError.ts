import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showError } from '@/store/slices/notificationSlice';
import { ApiError } from '@/lib/api';
import type { AppDispatch } from '@/store';

interface UseApiErrorOptions {
  error: Error | null | undefined;
  isError: boolean;
  refetch?: () => void;
}


export function useApiError({ error, isError, refetch }: UseApiErrorOptions) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError;

      dispatch(showError({
        message: apiError.message || 'An error occurred',
        description: apiError.isNetworkError 
          ? 'Please check your internet connection'
          : undefined,
      }));
    }
  }, [isError, error, dispatch]);

  return {
    retry: refetch,
    isNetworkError: error instanceof ApiError && (error as ApiError).isNetworkError,
  };
}

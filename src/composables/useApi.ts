import { ref, computed } from 'vue';
import type { Ref } from 'vue';

interface UseApiOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useApi<T = any>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const isReady = computed(() => !loading.value && data.value !== null);
  const hasError = computed(() => error.value !== null);

  async function execute() {
    try {
      loading.value = true;
      error.value = null;
      
      const result = await apiCall();
      data.value = result;
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      error.value = err as Error;
      
      if (options.onError) {
        options.onError(err as Error);
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    data.value = null;
    error.value = null;
    loading.value = false;
  }

  // Execute immediately if requested
  if (options.immediate) {
    execute();
  }

  return {
    data,
    loading,
    error,
    isReady,
    hasError,
    execute,
    reset
  };
}
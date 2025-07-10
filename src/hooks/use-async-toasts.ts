import { useRef } from "react";
import { toast } from "sonner";

interface AsyncToastOptions {
  loading?: string;
  success?: string;
  error?: string;
}

/**
 * Hook for managing async operation toasts
 */
export const useAsyncToasts = ({
  loading = "Loading...",
  success = "Success!",
  error = "Error",
}: AsyncToastOptions = {}) => {
  const toastIdRef = useRef<string | number | null>(null);
  
  return {
    onMutate: (loadingMessage?: string) => {
      toastIdRef.current = toast.loading(loadingMessage || loading, {
        duration: 10_000,
      });
    },
    
    onSuccess: (successMessage?: string) => {
      toast.success(successMessage || success, {
        id: toastIdRef.current!,
        duration: 3000,
      });
      toastIdRef.current = null;
    },
    
    onError: (errorMessage?: string) => {
      toast.error(errorMessage || error, {
        id: toastIdRef.current!,
        duration: 4000,
      });
      toastIdRef.current = null;
    },
    
    dismiss: () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    },
  };
};

/**
 * Utility function to wrap async operations with toast notifications
 */
export async function withAsyncToast<T>(
  operation: () => Promise<T>,
  options: AsyncToastOptions & {
    onSuccess?: (result: T) => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<T | null> {
  const toastId = toast.loading(options.loading || "Loading...", {
    duration: 10_000,
  });
  
  try {
    const result = await operation();
    
    toast.success(options.success || "Success!", {
      id: toastId,
      duration: 3000,
    });
    
    options.onSuccess?.(result);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    toast.error(options.error ? `${options.error}: ${errorMessage}` : errorMessage, {
      id: toastId,
      duration: 4000,
    });
    
    options.onError?.(error instanceof Error ? error : new Error(errorMessage));
    return null;
  }
}
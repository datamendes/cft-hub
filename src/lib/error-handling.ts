import { toast } from "@/hooks/use-toast";

export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

export function mapError(error: unknown, fallback: string = "An unexpected error occurred"): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallback;
}

export function handleError(error: unknown, fallback?: string) {
  const message = mapError(error, fallback);
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
  console.error("Error:", error);
}

export function handleSuccess(message: string) {
  toast({
    title: "Success",
    description: message,
  });
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | undefined> {
  try {
    const result = await operation();
    if (successMessage) {
      handleSuccess(successMessage);
    }
    return result;
  } catch (error) {
    handleError(error, errorMessage);
    return undefined;
  }
}
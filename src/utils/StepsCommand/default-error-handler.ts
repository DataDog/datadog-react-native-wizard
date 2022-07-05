export const defaultErrorHandlerWithDetails =
  (details: string[]) => async (error: unknown) => {
    return {
      error,
      terminating: false,
      details,
    };
  };

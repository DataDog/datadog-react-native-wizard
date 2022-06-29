export const defaultErrorHandler = async (error: unknown) => {
  return {
    error,
    terminating: false,
  };
};

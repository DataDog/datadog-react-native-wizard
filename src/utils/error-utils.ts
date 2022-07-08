interface ErrorWithMessage {
  message: string;
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return !!(typeof error === "object" && error && "message" in error);
};

export const getErrorMessage = (error: unknown): string | null => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return null;
};

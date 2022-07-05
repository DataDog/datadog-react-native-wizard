export type StepResult =
  | SuccessfulStepResult
  | ErrorStepResult
  | SkippedStepResult;

export type SuccessfulStepResult = {
  status: "success";
  name: string;
};

export type ErrorStepResult = {
  status: "error";
  terminating: boolean;
  name: string;
  error: unknown;
  details?: string[];
};

export type SkippedStepResult = {
  status: "skipped";
  name: string;
};
export interface StepError {
  terminating: boolean;
  error: unknown;
  details?: string[];
}

export type Step = {
  stepFunction: (...args: unknown[]) => unknown;
  errorHandler: (error: unknown) => Promise<StepError>;
  name: string;
};

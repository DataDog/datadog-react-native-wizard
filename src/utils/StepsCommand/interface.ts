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
};

export type SkippedStepResult = {
  status: "skipped";
  name: string;
};
export interface StepError {
  terminating: boolean;
  error: unknown;
}

export type Step = {
  stepFunction: (...args: unknown[]) => unknown;
  errorHandler: (error: unknown) => Promise<StepError>;
  name: string;
};

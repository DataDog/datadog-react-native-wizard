export type StepResult =
  | {
      status: "success";
      name: string;
    }
  | {
      status: "error";
      terminating: boolean;
      name: string;
      error: unknown;
    }
  | {
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

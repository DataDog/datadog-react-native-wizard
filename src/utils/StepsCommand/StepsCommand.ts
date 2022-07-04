import { Output } from "../output/interface";
import {
  ErrorStepResult,
  SkippedStepResult,
  Step,
  StepResult,
  SuccessfulStepResult,
} from "./interface";
import { Printer } from "./Printer";

export class StepsCommand {
  private steps: Step[];
  private name: string;
  private printer: Printer;

  constructor({
    steps,
    name,
    output,
  }: {
    steps: Step[];
    name: string;
    output: Output;
  }) {
    this.steps = steps;
    this.name = name;
    this.printer = new Printer(output);
  }

  public run = async () => {
    this.printer.printCommandName(this.name);

    let results: StepResult[] = [];
    for (let stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
      const step = this.steps[stepIndex];
      this.printer.startStep(step.name);

      if (shouldSkipStep(results)) {
        const stepResult: SkippedStepResult = {
          status: "skipped",
          name: step.name,
        };
        results.push(stepResult);
        this.printer.printEndStepMessage(stepResult);
        continue;
      }

      try {
        await step.stepFunction();
        const stepResult: SuccessfulStepResult = {
          status: "success",
          name: step.name,
        };
        results.push(stepResult);
      } catch (error) {
        const stepError = await step.errorHandler(error);
        const stepResult: ErrorStepResult = {
          status: "error",
          error: stepError.error,
          terminating: stepError.terminating,
          name: step.name,
        };

        results.push(stepResult);
        this.printer.printEndStepMessage(stepResult);
      }
    }

    const terminatingStep = findTerminatingStep(results);
    this.printer.printEndMessage(results, this.name, terminatingStep);
    if (terminatingStep) {
      return 1;
    }
    return 0;
  };
}

const shouldSkipStep = (results: StepResult[]) => {
  return !!findTerminatingStep(results);
};

const findTerminatingStep = (results: StepResult[]) => {
  return results.find(
    (step) => step.status === "error" && step.terminating
  ) as ErrorStepResult;
};

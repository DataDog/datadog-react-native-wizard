import { Output } from "../output/interface";
import {
  ErrorStepResult,
  SkippedStepResult,
  Step,
  StepResult,
  SuccessfulStepResult,
} from "./interface";
import { Printer } from "./Printer";
import { Store } from "./Store";

export class StepsCommand<StateType extends object | void> {
  private steps: Step<StateType>[];
  private name: string;
  private printer: Printer;
  private store: Store<StateType>;

  constructor({
    steps,
    name,
    output,
    initialState,
  }: {
    steps: Step<StateType>[];
    name: string;
    output: Output;
    initialState: StateType;
  }) {
    this.steps = steps;
    this.name = name;
    this.printer = new Printer(output);
    this.store = new Store(initialState);
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
        await step.stepFunction(this.store);
        const stepResult: SuccessfulStepResult = {
          status: "success",
          name: step.name,
        };
        results.push(stepResult);
      } catch (error) {
        const stepError = await step.errorHandler(error);
        const stepResult: ErrorStepResult = {
          status: "error",
          name: step.name,
          ...stepError,
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

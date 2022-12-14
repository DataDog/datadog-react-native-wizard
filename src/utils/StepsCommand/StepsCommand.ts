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

export class StepsCommand<
  StateType extends object | void,
  InitialStateType extends object | void
> {
  private steps: Step<StateType>[];
  private name: string;
  private printer: Printer;
  private initialState: InitialStateType;
  private storeValidator: (initialState: InitialStateType) => StateType;
  private storeValidatorErrorHandler: (error: unknown) => string;

  constructor({
    steps,
    name,
    output,
    initialState,
    storeValidator,
    storeValidatorErrorHandler,
  }: {
    steps: Step<StateType>[];
    name: string;
    output: Output;
    initialState: InitialStateType;
    storeValidator: (initialState: InitialStateType) => StateType;
    storeValidatorErrorHandler: (error: unknown) => string;
  }) {
    this.steps = steps;
    this.name = name;
    this.printer = new Printer(output);
    this.initialState = initialState;
    this.storeValidator = storeValidator;
    this.storeValidatorErrorHandler = storeValidatorErrorHandler;
  }

  public run = async () => {
    this.printer.printCommandName(this.name);

    const [store, error] = this.buildStore();
    if (error) {
      return 1;
    }

    const results = await this.runSteps(store);

    const terminatingStep = findTerminatingStep(results);
    this.printer.printEndMessage(results, this.name, terminatingStep);
    if (terminatingStep) {
      return 1;
    }
    return 0;
  };

  private buildStore = (): [Store<StateType>, null] | [null, Error] => {
    try {
      return [new Store(this.storeValidator(this.initialState)), null];
    } catch (error) {
      this.printer.printValidationError(this.storeValidatorErrorHandler(error));
      return [null, error as Error];
    }
  };

  private runSteps = async (store: Store<StateType>): Promise<StepResult[]> => {
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
        await step.stepFunction(store);
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

    return results;
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

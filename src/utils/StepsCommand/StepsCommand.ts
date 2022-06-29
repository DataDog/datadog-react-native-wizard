import { Step, StepResult } from "./interface";

export class StepsCommand {
  private steps: Step[];
  private startMessage: string[];
  private endMessage: (results: StepResult[]) => Promise<string[]>;

  constructor({
    steps,
    startMessage,
    endMessage,
  }: {
    steps: Step[];
    startMessage: string[];
    endMessage: (results: StepResult[]) => Promise<string[]>;
  }) {
    this.steps = steps;
    this.startMessage = startMessage;
    this.endMessage = endMessage;
  }

  public run = async () => {
    console.log(this.startMessage);

    let results: StepResult[] = [];
    for (let stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
      const step = this.steps[stepIndex];
      console.log(`Starting step: ${step.name}`);

      if (shouldSkipStep(results)) {
        results.push({
          status: "skipped",
          name: step.name,
        });
        console.log(`Skipped step: ${step.name}`);
        continue;
      }

      try {
        await step.stepFunction();
        results.push({
          status: "success",
          name: step.name,
        });
        console.log(`Successful step: ${step.name}`);
      } catch (error) {
        const stepError = await step.errorHandler(error);
        results.push({
          status: "error",
          error: stepError.error,
          terminating: stepError.terminating,
          name: step.name,
        });
        console.log(`Step error: ${step.name}`);
      }
    }

    console.log(await this.endMessage(results));
  };
}

const shouldSkipStep = (results: StepResult[]) => {
  return results.some((step) => step.status === "error" && step.terminating);
};

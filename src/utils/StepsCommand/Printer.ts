import chalk from "chalk";
import { WriteStream } from "tty";
import { getErrorMessage } from "../error-utils";
import { Output } from "../output/interface";
import { ErrorStepResult, StepResult } from "./interface";

export class Printer {
  private stdout: WriteStream;
  private stderr: WriteStream;

  constructor(output: Output) {
    this.stdout = output.stdout;
    this.stderr = output.stderr;
  }

  public printCommandName = (name: string) => {
    this.stdout.write(`Starting command: ${chalk.bold(name)}\n`);
  };

  public startStep = (name: string) => {
    this.stdout.write(`⚙️  Running task: ${name}.\n`);
  };

  public printEndStepMessage = (result: StepResult) => {
    this.printStepResult(result);
    this.stdout.write(`\n`);
  };

  private printStepResult = (result: StepResult) => {
    if (result.status === "success") {
      this.endStep(result.name);
    }
    if (result.status === "skipped") {
      this.skipStep(result.name);
    }
    if (result.status === "error") {
      this.errorStep(
        result.name,
        result.terminating,
        result.error,
        result.details
      );
    }
  };

  private endStep = (name: string) => {
    this.stdout.write(chalk.green(`✅ Successfully executed: ${name}.\n`));
  };

  private skipStep = (name: string) => {
    this.stdout.write(chalk.yellow(`⚠️ Skipped ${name} step.\n`));
  };

  private errorStep = (
    name: string,
    terminating: boolean,
    error: unknown,
    details?: string[]
  ) => {
    this.stdout.write(
      chalk.red(
        `❌ ${
          terminating ? "Fatal error" : "Error"
        } encountered while running ${name} step.\n`
      )
    );
    if (details) {
      details.forEach((line) => {
        this.stdout.write(`${line}\n`);
      });
    }
    if (getErrorMessage(error)) {
      this.stdout.write(chalk.red(getErrorMessage(error)));
    }
  };

  public printEndMessage = (
    results: StepResult[],
    name: string,
    terminatingStepResult?: ErrorStepResult
  ) => {
    this.stdout.write(
      `\n\n${chalk.bold(`Finished running command ${name}`)}\n\n`
    );
    results.forEach((result) => {
      this.printStepResult(result);
    });

    if (terminatingStepResult) {
      this.stderr.write(
        `Process was stopped due to error in step ${terminatingStepResult.name}\n`
      );
      this.stderr.write(`${terminatingStepResult.error}`);
    }
  };
}

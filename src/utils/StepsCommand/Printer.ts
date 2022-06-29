import chalk from "chalk";
import { WriteStream } from "tty";
import { ErrorStepResult, StepResult } from "./interface";

export class Printer {
  private stdout: WriteStream;
  private stderr: WriteStream;

  constructor(stdout: WriteStream, stderr: WriteStream) {
    this.stdout = stdout;
    this.stderr = stderr;
  }

  public printStartMessage = (message: string[]) => {
    message.forEach((line) => {
      this.stdout.write(`${line}\n`);
    });
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
      this.errorStep(result.name, result.terminating, result.error);
    }
  };

  private endStep = (name: string) => {
    this.stdout.write(chalk.green(`✅ Successfully executed: ${name}.\n`));
  };

  private skipStep = (name: string) => {
    this.stdout.write(chalk.yellow(`⚠️ Skipped ${name} step.\n`));
  };

  private errorStep = (name: string, terminating: boolean, error: unknown) => {
    this.stdout.write(
      chalk.red(
        `❌ ${
          terminating ? "Fatal error" : "Error"
        } encountered while running ${name} step.\n`
      )
    );
  };

  public printEndMessage = (
    results: StepResult[],
    terminatingStepResult?: ErrorStepResult
  ) => {
    this.stdout.write(
      `\n\n🐕🪄 ${chalk.bold("Datadog React Native wizard summary")}\n\n`
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

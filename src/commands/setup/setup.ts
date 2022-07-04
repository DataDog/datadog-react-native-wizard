import { Command, Option } from "clipanion";
import { Output } from "../../utils/output/interface";
import { defaultErrorHandler } from "../../utils/StepsCommand/default-error-handler";
import { StepsCommand } from "../../utils/StepsCommand/StepsCommand";
import { addDependencies } from "./add-dependencies/add-dependencies";
import { applyGradleTask } from "./apply-gradle-task/apply-gradle-task";
import { changeXCodeBuildPhase } from "./change-xcode-build-phase/change-xcode-build-phase";
import { createPropertiesFiles } from "./create-properties-files/create-properties-files";

export class SetupCommand extends Command {
  static paths = [];
  absoluteProjectPath = Option.String({ required: false });

  async execute() {
    if (!this.absoluteProjectPath) {
      this.absoluteProjectPath = process.cwd();
    }

    const output: Output = {
      stderr: process.stderr,
      stdout: process.stdout,
    };

    const absoluteProjectPath = this.absoluteProjectPath;
    const setupCommand = new StepsCommand({
      output,
      steps: [
        {
          name: "get sourcemaps upload variables",
          stepFunction: () => createPropertiesFiles(absoluteProjectPath),
          errorHandler: defaultErrorHandler,
        },
        {
          name: "add required dependencies",
          stepFunction: () => addDependencies(absoluteProjectPath, output),
          errorHandler: defaultErrorHandler,
        },
        {
          name: "automate sourcemaps upload on iOS builds",
          stepFunction: () => changeXCodeBuildPhase(absoluteProjectPath),
          errorHandler: defaultErrorHandler,
        },
        {
          name: "automate android upload on iOS builds",
          stepFunction: () => applyGradleTask(absoluteProjectPath),
          errorHandler: defaultErrorHandler,
        },
      ],
      name: "Setup the automated upload of javascript sourcemaps to Datadog",
    });

    await setupCommand.run();
  }
}

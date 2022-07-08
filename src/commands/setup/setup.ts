import { Command, Option } from "clipanion";
import { Output } from "../../utils/output/interface";
import { defaultErrorHandlerWithDetails } from "../../utils/StepsCommand/default-error-handler";
import { StepsCommand } from "../../utils/StepsCommand/StepsCommand";
import { addDependencies } from "./add-dependencies/add-dependencies";
import { addDependenciesErrorDetails } from "./add-dependencies/error-details";
import { addXCodeDsymsBuildPhase } from "./add-xcode-dsyms-build-phase/add-xcode-dsyms-build-phase";
import { addXCodeDsymsBuildPhaseErrorDetails } from "./add-xcode-dsyms-build-phase/error-details";
import { applyGradleTask } from "./apply-gradle-task/apply-gradle-task";
import { applyGradleTaskErrorHandler } from "./apply-gradle-task/error-handler";
import { changeXCodeBuildPhase } from "./change-xcode-build-phase/change-xcode-build-phase";
import { changeXCodeBuildPhaseErrorDetails } from "./change-xcode-build-phase/error-details";
import { createConfigurationFiles } from "./create-configuration-files/create-configuration-files";
import { createConfigurationFilesErrorHandler } from "./create-configuration-files/error-handler";

type CommandStateType = {
  datadogSite?: string;
};

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
    const setupCommand = new StepsCommand<CommandStateType>({
      output,
      steps: [
        {
          name: "get sourcemaps upload variables",
          stepFunction: () => createConfigurationFiles(absoluteProjectPath),
          errorHandler: createConfigurationFilesErrorHandler,
        },
        {
          name: "add required dependencies",
          stepFunction: () => addDependencies(absoluteProjectPath, output),
          errorHandler: defaultErrorHandlerWithDetails(
            addDependenciesErrorDetails
          ),
        },
        {
          name: "automate sourcemaps upload on iOS builds",
          stepFunction: () => changeXCodeBuildPhase(absoluteProjectPath),
          errorHandler: defaultErrorHandlerWithDetails(
            changeXCodeBuildPhaseErrorDetails
          ),
        },
        {
          name: "automate sourcemaps upload on Android builds",
          stepFunction: () => applyGradleTask(absoluteProjectPath),
          errorHandler: applyGradleTaskErrorHandler,
        },
        {
          name: "automate dSYMs upload on iOS builds",
          stepFunction: () => addXCodeDsymsBuildPhase(absoluteProjectPath),
          errorHandler: defaultErrorHandlerWithDetails(
            addXCodeDsymsBuildPhaseErrorDetails
          ),
        },
      ],
      name: "Setup the automated upload of javascript sourcemaps to Datadog",
      initialState: {},
    });

    await setupCommand.run();
  }
}

import { Command, Option } from "clipanion";
import { Output } from "../../utils/output/interface";
import { defaultErrorHandlerWithDetails } from "../../utils/StepsCommand/default-error-handler";
import { StepsCommand } from "../../utils/StepsCommand/StepsCommand";
import { addDependencies } from "./add-dependencies/add-dependencies";
import { addDependenciesErrorDetails } from "./add-dependencies/error-details";
import { addXCodeDsymsBuildPhase } from "./add-xcode-dsyms-build-phase/add-xcode-dsyms-build-phase";
import { addXCodeDsymsBuildPhaseErrorDetails } from "./add-xcode-dsyms-build-phase/error-details";
import { applyGradlePlugin } from "./apply-gradle-plugin/apply-gradle-plugin";
import { applyGradlePluginErrorHandler } from "./apply-gradle-plugin/error-handler";
import { applyGradleTask } from "./apply-gradle-task/apply-gradle-task";
import { applyGradleTaskErrorHandler } from "./apply-gradle-task/error-handler";
import { changeXCodeBuildPhase } from "./change-xcode-build-phase/change-xcode-build-phase";
import { changeXCodeBuildPhaseErrorDetails } from "./change-xcode-build-phase/error-details";
import { createConfigurationFiles } from "./create-configuration-files/create-configuration-files";
import { createConfigurationFilesErrorHandler } from "./create-configuration-files/error-handler";
import { ApiKeyNotProvided, DatadogSiteValueError } from "./errors";
import { DatadogSite } from "./interface";
import { validateInitialState } from "./validation";

export type SetupCommandStateType = {
  androidMinificationEnabled?: boolean;
  apiKey?: string;
  bypassPrompts: boolean;
  datadogSite?: DatadogSite;
  intakeUrl?: string;
};

export class SetupCommand extends Command {
  static paths = [];
  absoluteProjectPath = Option.String({ required: false });
  androidMinificationEnabled = Option.Boolean("--android-minification");
  apiKey = Option.String("--api-key", { required: false });
  bypassPrompts = Option.Boolean("--bypass-prompts");
  intakeUrl = Option.String("--intake-url", { required: false });
  datadogSite = Option.String("--datadog-site", { required: false });

  async execute() {
    if (!this.absoluteProjectPath) {
      this.absoluteProjectPath = process.cwd();
    }

    const output: Output = {
      stderr: process.stderr,
      stdout: process.stdout,
    };

    try {
      const initialState = validateInitialState({
        androidMinificationEnabled: this.androidMinificationEnabled,
        apiKey: this.apiKey,
        bypassPrompts: !!this.bypassPrompts,
        datadogSite: this.datadogSite,
        intakeUrl: this.intakeUrl,
      });

      const absoluteProjectPath = this.absoluteProjectPath;
      const setupCommand = new StepsCommand<SetupCommandStateType>({
        output,
        steps: [
          {
            name: "get sourcemaps upload variables",
            stepFunction: (store) =>
              createConfigurationFiles(absoluteProjectPath, store),
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
          {
            name: "automate proguard mapping files upload on android builds",
            stepFunction: (store) =>
              applyGradlePlugin(absoluteProjectPath, store),
            errorHandler: applyGradlePluginErrorHandler,
          },
        ],
        name: "Setup the automated upload of javascript sourcemaps to Datadog",
        initialState,
      });

      await setupCommand.run();
    } catch (error) {
      if (error instanceof DatadogSiteValueError) {
        output.stderr.write(
          `Datadog site "${this.datadogSite}" is not a valid site.`
        );
      }
      if (error instanceof ApiKeyNotProvided) {
        output.stderr.write(`API key "${this.apiKey}" is not a valid API key.`);
      }
      return 1;
    }
  }
}

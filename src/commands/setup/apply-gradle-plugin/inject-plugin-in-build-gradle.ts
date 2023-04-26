import { EOL } from "os";
import { GradlePluginNotAutomated, GradlePluginNotInstalled } from "../errors";
import { editFile } from "../utils/edit-file";

/**
 * This enum represents the state of the automation injection process.
 * First we start in the BEFORE_ANDROID_CLOSURE state.
 * When we enter the `android` closure, we go in IN_ANDROID_CLOSURE state.
 * When we reach the end of the android closure, we inject the automation and go into DONE state.
 */
const enum AutomationState {
  BEFORE_ANDROID_CLOSURE = "BEFORE_ANDROID_CLOSURE",
  IN_ANDROID_CLOSURE = "IN_ANDROID_CLOSURE",
  DONE = "DONE",
}

const AUTOMATION_BLOCK = [
  `    applicationVariants.all { variant ->`,
  `        if (project.tasks.findByName("minify\${variant.name.capitalize()}WithR8")) {`,
  `            tasks["minify\${variant.name.capitalize()}WithR8"].finalizedBy { tasks["uploadMapping\${variant.name.capitalize()}"] }`,
  `        }`,
  `    }`,
  ``,
];

export const injectPluginInBuildGradle = async (
  androidAppBuildGradleInputFile: string,
  androidAppBuildGradleOutputFile: string
) => {
  let hasAddedPluginAndConfiguration = false;
  let hasAddedAutomationState: AutomationState =
    AutomationState.BEFORE_ANDROID_CLOSURE;
  await editFile(
    androidAppBuildGradleInputFile,
    androidAppBuildGradleOutputFile,
    (line: string) => {
      if (!hasAddedPluginAndConfiguration) {
        hasAddedPluginAndConfiguration = true;
        const installationBlock = [
          `plugins {`,
          `    id("com.datadoghq.dd-sdk-android-gradle-plugin") version "1.5.+"`,
          `}`,
          ``,
          `datadog {`,
          `    checkProjectDependencies = "none"`,
          `}`,
          ``,
        ].join(EOL);

        return `${installationBlock}${EOL}${line}`;
      }

      // Entering the android closure
      if (
        line.match(/^android {/) &&
        hasAddedAutomationState === AutomationState.BEFORE_ANDROID_CLOSURE
      ) {
        hasAddedAutomationState = AutomationState.IN_ANDROID_CLOSURE;
      }

      // Reaching the end of the android closure
      if (
        line.match(/^}$/) &&
        hasAddedAutomationState === AutomationState.IN_ANDROID_CLOSURE
      ) {
        hasAddedAutomationState = AutomationState.DONE;
        return `${EOL}${AUTOMATION_BLOCK.join(EOL)}${line}`;
      }

      return line;
    }
  );

  if (!hasAddedPluginAndConfiguration) {
    throw new GradlePluginNotInstalled();
  }
  if ((hasAddedAutomationState as AutomationState) !== AutomationState.DONE) {
    throw new GradlePluginNotAutomated();
  }
};

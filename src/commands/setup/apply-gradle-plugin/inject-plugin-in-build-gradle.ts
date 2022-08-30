import { EOL } from "os";
import { GradlePluginNotAutomated, GradlePluginNotInstalled } from "../errors";
import { editFile } from "../utils/edit-file";

export const injectPluginInBuildGradle = async (
  androidAppBuildGradleInputFile: string,
  androidAppBuildGradleOutputFile: string
) => {
  let hasAddedPluginAndConfiguration = false;
  let hasAddedAutomation = false;
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

      if (line.match("applicationVariants.all") && !hasAddedAutomation) {
        hasAddedAutomation = true;
        const automationBlock = [
          `        if (project.tasks.findByName("minify\${variant.name.capitalize()}WithR8")) {`,
          `            tasks["minify\${variant.name.capitalize()}WithR8"].finalizedBy { tasks["uploadMapping\${variant.name.capitalize()}"] }`,
          `        }`,
          ``,
        ].join(EOL);

        return `${line}${EOL}${automationBlock}`;
      }

      return line;
    }
  );

  if (!hasAddedPluginAndConfiguration) {
    throw new GradlePluginNotInstalled();
  }
  if (!hasAddedAutomation) {
    throw new GradlePluginNotAutomated();
  }
};

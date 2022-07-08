import { EOL } from "os";
import { editFile } from "../utils/edit-file";

export const injectPluginInBuildGradle = async (
  androidAppBuildGradleInputFile: string,
  androidAppBuildGradleOutputFile: string,
  state: { datadogSite?: string }
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
          `    id("com.datadoghq.dd-sdk-android-gradle-plugin") version "1.4.0"`,
          `}`,
          ``,
          `datadog {`,
          `    checkProjectDependencies = "none"`,
          getDatadogSiteLine(state.datadogSite),
          `}`,
          ``,
        ].join(EOL);

        return `${installationBlock}${EOL}${line}`;
      }

      if (line.match("variant ->") && !hasAddedAutomation) {
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
    throw new Error("could not init plugin");
  }
  if (!hasAddedAutomation) {
    throw new Error("could not add automation");
  }
};

const getDatadogSiteLine = (datadogSite?: string): string => {
  if (!datadogSite) return "";
  return `    site = "${datadogSite}"`;
};

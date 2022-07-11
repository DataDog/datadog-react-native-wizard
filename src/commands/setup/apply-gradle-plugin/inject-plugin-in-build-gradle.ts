import { EOL } from "os";
import { GradlePluginNotAutomated, GradlePluginNotInstalled } from "../errors";
import { DatadogSite } from "../interface";
import { editFile } from "../utils/edit-file";

export const injectPluginInBuildGradle = async (
  androidAppBuildGradleInputFile: string,
  androidAppBuildGradleOutputFile: string,
  state: { datadogSite?: DatadogSite }
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

/**
 * For now our sites match with the configuration here: https://github.com/DataDog/dd-sdk-android-gradle-plugin/blob/develop/dd-sdk-android-gradle-plugin/src/main/kotlin/com/datadog/gradle/plugin/DatadogSite.kt
 * This "duplicated" typing is to ensure we don't accidentaly break compatibility here
 */
type GradlePluginDatadogSite = "US" | "EU" | "US3" | "US5" | "GOV";

const getDatadogSiteLine = (datadogSite?: GradlePluginDatadogSite): string => {
  if (!datadogSite) return "";
  return `    site = "${datadogSite}"`;
};

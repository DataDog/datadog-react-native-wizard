import { checkDependencyStatus } from "./check-dependency-status";
import { checkIsRNProject } from "./check-is-rn-project";
import { getDependencyInstaller } from "./dependency-installer/get-dependency-installer";
import { Output } from "../../../utils/output/interface";

/**
 * This adds the following dependencies:
 * - @datadog/datadog-ci
 *
 * If the dependencies version is too old, they are upgraded
 *
 * @throws error if not in RN Project
 */
export const addDependencies = async (
  absoluteProjectPath: string,
  output: Output
) => {
  checkIsRNProject(absoluteProjectPath);
  const dependencyStatus = checkDependencyStatus(
    "@datadog/datadog-ci",
    "1.13.3",
    { absoluteProjectPath: absoluteProjectPath }
  );
  if (dependencyStatus !== "OK") {
    const dependencyInstaller = getDependencyInstaller("@datadog/datadog-ci", {
      dev: true,
      absoluteProjectPath,
    });
    await dependencyInstaller.installDependency(output);
  }
};

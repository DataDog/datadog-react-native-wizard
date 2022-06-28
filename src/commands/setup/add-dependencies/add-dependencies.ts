import { checkDependencyStatus } from "./check-dependency-status";
import { checkIsRNProject } from "./check-is-rn-project";
import { spawn } from "child_process";
import { getDependencyInstaller } from "./dependency-installer/get-dependency-installer";

/**
 * This adds the following dependencies:
 * - @datadog/datadog-ci
 *
 * If the dependencies version is too old, they are upgraded
 *
 * @throws error if not in RN Project
 */
export const addDependencies = async () => {
  checkIsRNProject();
  const dependencyStatus = checkDependencyStatus(
    "@datadog/datadog-ci",
    "1.7.3"
  );
  if (dependencyStatus !== "OK") {
    const dependencyInstaller = getDependencyInstaller("@datadog/datadog-ci", {
      dev: true,
    });
    await dependencyInstaller.installDependency();
  }
};

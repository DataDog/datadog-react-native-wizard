import {
  formatDependencyVersion,
  isDependencyVersionOver,
} from "../utils/get-rn-version";

export const checkDependencyStatus = (
  dependencyName: string,
  minVersion: string,
  options: { absoluteProjectPath: string }
): "NOT_INSTALLED" | "OK" | "OUTDATED" => {
  const packageJSON = require(`${options.absoluteProjectPath}/package.json`);
  const installedVersion =
    packageJSON.devDependencies && packageJSON.devDependencies[dependencyName];
  if (!installedVersion) {
    return "NOT_INSTALLED";
  }

  if (
    isDependencyVersionOver(
      formatDependencyVersion(installedVersion),
      minVersion
    )
  ) {
    return "OK";
  }

  return "OUTDATED";
};

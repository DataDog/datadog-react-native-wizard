export const checkDependencyStatus = (
  dependencyName: string,
  minVersion: string,
  options: { projectPath: string }
): "NOT_INSTALLED" | "OK" | "OUTDATED" => {
  const packageJSON = require(`${process.cwd()}/${
    options.projectPath
  }/package.json`);
  const installedVersion =
    packageJSON.devDependencies && packageJSON.devDependencies[dependencyName];
  if (!installedVersion) {
    return "NOT_INSTALLED";
  }

  const installedVersionAsArray = installedVersion.split(".");
  const minVersionAsArray = minVersion.split(".");
  if (
    minVersionAsArray.some(
      (value, index) => value > installedVersionAsArray[index] || 0
    )
  ) {
    return "OUTDATED";
  }

  return "OK";
};
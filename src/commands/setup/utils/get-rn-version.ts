export const getRNVersion = (
  absoluteProjectPath: string
): DependencyVersion => {
  const packageJSON = require(`${absoluteProjectPath}/package.json`);
  const RNVersion = packageJSON.dependencies["react-native"];

  return formatDependencyVersion(RNVersion);
};

export type DependencyVersion = {
  major: number;
  minor: number;
  patch: string; // Patch can be 2-rc1
};

export const getDatadogVersion = (absoluteProjectPath: string) => {
  const packageJSON = require(`${absoluteProjectPath}/package.json`);
  const RNVersion = packageJSON.dependencies["@datadog/mobile-react-native"];

  return formatDependencyVersion(RNVersion);
};

export const isPackageVersionOver = (
  packageVersion: DependencyVersion,
  limitVersion: string
) => {
  const formattedLimitVersion = formatDependencyVersion(limitVersion);
  if (packageVersion.major < formattedLimitVersion.major) {
    return false;
  }
  if (packageVersion.major > formattedLimitVersion.major) {
    return true;
  }

  if (packageVersion.minor < formattedLimitVersion.minor) {
    return false;
  }
  if (packageVersion.minor > formattedLimitVersion.minor) {
    return true;
  }

  const [packagePatch, packageRC] = packageVersion.patch.split("-rc");
  const [limitPatch, limitRC] = formattedLimitVersion.patch.split("-rc");

  if (packagePatch < limitPatch) {
    return false;
  }
  if (packagePatch > limitPatch) {
    return true;
  }

  if (packageRC && limitRC) {
    return packageRC >= limitRC;
  }

  return !packageRC;
};

export const formatDependencyVersion = (
  version: unknown
): DependencyVersion => {
  if (typeof version !== "string") {
    throw new Error("No RN version in package.json");
  }

  const [major, minor, patch] = version.split(".");

  return {
    major: Number(major),
    minor: Number(minor),
    patch,
  };
};

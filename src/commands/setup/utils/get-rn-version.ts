export const getRNVersion = (projectPath: string): DependencyVersion => {
  const packageJSON = require(`${process.cwd()}/${projectPath}/package.json`);
  const RNVersion = packageJSON.dependencies["react-native"];

  return formatDependencyVersion(RNVersion);
};

export type DependencyVersion = {
  major: number;
  minor: number;
  patch: string; // Patch can be 2-rc1
};

const formatDependencyVersion = (version: unknown): DependencyVersion => {
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

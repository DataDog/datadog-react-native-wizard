import { existsSync } from "fs";

export type PackageManager = "yarn" | "npm";

export const getPackageManager = (
  absoluteProjectPath: string
): PackageManager => {
  if (existsSync(`${absoluteProjectPath}/package-lock.json`)) {
    return "npm";
  }
  return "yarn";
};

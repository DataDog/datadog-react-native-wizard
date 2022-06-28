import { existsSync } from "fs";

type PackageManager = "yarn" | "npm";

export const getPackageManager = (projectPath: string): PackageManager => {
  if (existsSync(`${projectPath}/package-lock.json`)) {
    return "npm";
  }
  return "yarn";
};

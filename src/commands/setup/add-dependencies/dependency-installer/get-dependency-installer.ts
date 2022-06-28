import { existsSync } from "fs";
import { DependencyInstaller } from "./dependency-installer";
import { npmDependencyInstaller } from "./npm";
import { yarnDependencyInstaller } from "./yarn";

// Don't move this function to dependency-installer.ts or the code will break
// because of circular imports
export const getDependencyInstaller = (
  dependency: string,
  options: { dev?: boolean; projectPath: string }
): DependencyInstaller => {
  if (existsSync(`${options.projectPath}/package-lock.json`)) {
    return new npmDependencyInstaller(dependency, options);
  }
  return new yarnDependencyInstaller(dependency, options);
};

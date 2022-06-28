import { getPackageManager } from "../../utils/get-package-manager";
import { DependencyInstaller } from "./dependency-installer";
import { npmDependencyInstaller } from "./npm";
import { yarnDependencyInstaller } from "./yarn";

// Don't move this function to dependency-installer.ts or the code will break
// because of circular imports
export const getDependencyInstaller = (
  dependency: string,
  options: { dev?: boolean; projectPath: string }
): DependencyInstaller => {
  if (getPackageManager(options.projectPath) === "npm") {
    return new npmDependencyInstaller(dependency, options);
  }
  return new yarnDependencyInstaller(dependency, options);
};

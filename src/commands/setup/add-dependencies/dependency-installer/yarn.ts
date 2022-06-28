import { DependencyInstaller } from "./dependency-installer";

export class yarnDependencyInstaller extends DependencyInstaller {
  buildInstallCommand = () => {
    return `yarn add ${this.options.dev ? "--dev" : ""} ${this.dependency}`;
  };
}

import { DependencyInstaller } from "./dependency-installer";

export class npmDependencyInstaller extends DependencyInstaller {
  buildInstallCommand = () => {
    return `npm install ${this.options.dev ? "--save-dev" : ""} ${
      this.dependency
    }`;
  };
}

import { exec } from "child_process";
import { displayOutputFromProcess } from "../../../../utils/output/display-output-from-process";
import { Output } from "../../../../utils/output/interface";

export abstract class DependencyInstaller {
  protected dependency: string;
  protected options: { dev?: boolean; absoluteProjectPath: string };
  protected abstract buildInstallCommand: () => string;

  constructor(
    dependency: string,
    options: { dev?: boolean; absoluteProjectPath: string }
  ) {
    this.dependency = dependency;
    this.options = options;
  }

  public installDependency = async (output: Output) => {
    const bundleJSChildProcess = exec(this.buildInstallCommand(), {
      cwd: this.options.absoluteProjectPath,
      env: process.env,
    });

    displayOutputFromProcess(bundleJSChildProcess, output);

    const [status, signal] = await new Promise((resolve, reject) => {
      bundleJSChildProcess.on("error", (error: Error) => {
        reject(error);
      });

      bundleJSChildProcess.on(
        "close",
        (exitStatus: number, exitSignal: string) => {
          resolve([exitStatus, exitSignal]);
        }
      );
    });

    if (status !== 0) {
      throw new Error(`error ${signal} while installing`);
    }
  };
}

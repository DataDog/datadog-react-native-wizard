import { spawn } from "child_process";

export abstract class DependencyInstaller {
  protected dependency: string;
  protected options: { dev?: boolean };
  abstract buildInstallCommand: () => string;

  constructor(dependency: string, options: { dev?: boolean }) {
    this.dependency = dependency;
    this.options = options;
  }

  public installDependency = async () => {
    const bundleJSChildProcess = spawn(this.buildInstallCommand(), {
      env: process.env,
      stdio: ["inherit", "pipe", "pipe"],
    });

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

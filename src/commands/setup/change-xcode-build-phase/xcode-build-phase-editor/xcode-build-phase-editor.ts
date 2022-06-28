import events from "events";
import { createReadStream, createWriteStream, rename, unlinkSync } from "fs";
import readline from "readline";
import { EOL } from "os";

export abstract class XCodeBuildPhaseEditor {
  protected packageManagerBin: string;
  protected nodeBin: string;
  protected projectPath: string;
  protected outputFile: string;
  protected pbxprojFile: string;
  protected tempFile: string;

  constructor(options: {
    packageManagerBin: string;
    nodeBin: string;
    projectPath: string;
    outputFile: string;
    pbxprojFile: string;
  }) {
    this.packageManagerBin = options.packageManagerBin;
    this.nodeBin = options.nodeBin;
    this.projectPath = options.projectPath;
    this.outputFile = options.outputFile;
    this.pbxprojFile = options.pbxprojFile;
    this.tempFile = `${options.outputFile}.tmp`;
  }

  protected abstract getNewShellScript: (line: string) => string;

  public injectDatadogIntoProject = async () => {
    const lineReader = readline.createInterface({
      input: createReadStream(
        `${process.cwd()}/${this.projectPath}/${this.pbxprojFile}`
      ),
    });

    try {
      const writer = createWriteStream(
        `${process.cwd()}/${this.projectPath}/${this.tempFile}`,
        { flags: "a" }
      );

      // TODO: refactor this part
      let isInRNBuildPhaseBlock = false;

      lineReader.on("line", (line) => {
        let isShellScriptLine = false;
        if (line.match('name = "Bundle React Native code and images"')) {
          isInRNBuildPhaseBlock = true;
        }
        if (isInRNBuildPhaseBlock) {
          if (line.match("shellScript =")) {
            isShellScriptLine = true;
          }
        }
        writer.write(
          `${this.getLineToWrite(line, {
            isInRNBuildPhaseBlock,
            isShellScriptLine,
          })}${EOL}`
        );
        if (isInRNBuildPhaseBlock && isShellScriptLine) {
          isInRNBuildPhaseBlock = false;
        }
      });

      await events.once(lineReader, "close");

      return new Promise<void>((resolve, reject) => {
        rename(
          `${process.cwd()}/${this.projectPath}/${this.tempFile}`,
          `${process.cwd()}/${this.projectPath}/${this.outputFile}`,
          (error) => {
            if (error) {
              reject(error);
            }
            resolve();
          }
        );
      });
    } catch (error) {
      unlinkSync(`${process.cwd()}/${this.projectPath}/${this.tempFile}`);
      throw error;
    }
  };

  private getLineToWrite = (
    line: string,
    params: { isInRNBuildPhaseBlock: boolean; isShellScriptLine: boolean }
  ) => {
    if (!params.isInRNBuildPhaseBlock || !params.isShellScriptLine) {
      return line;
    }
    return this.getNewShellScript(line);
  };
}

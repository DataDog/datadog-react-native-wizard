import events from "events";
import { createReadStream, createWriteStream, rename, unlinkSync } from "fs";
import readline from "readline";
import { EOL } from "os";
import { editFile } from "../../utils/edit-file";

export abstract class XCodeBuildPhaseEditor {
  protected packageManagerBin: string;
  protected nodeBin: string;
  protected absoluteProjectPath: string;
  protected inputPbxprojFile: string;
  protected outputPbxprojFile: string;
  protected tempFile: string;

  constructor(options: {
    packageManagerBin: string;
    nodeBin: string;
    absoluteProjectPath: string;
    inputPbxprojFile: string;
    outputPbxprojFile: string;
  }) {
    this.packageManagerBin = options.packageManagerBin;
    this.nodeBin = options.nodeBin;
    this.absoluteProjectPath = options.absoluteProjectPath;
    this.inputPbxprojFile = options.inputPbxprojFile;
    this.outputPbxprojFile = options.outputPbxprojFile;
    this.tempFile = `${options.outputPbxprojFile}.tmp`;
  }

  protected abstract getNewShellScript: (line: string) => string;

  public abstract editBuildPhase: () => Promise<void>;

  protected injectDatadogIntoProjectPbxproj = async () => {
    try {
      let isInRNBuildPhaseBlock = false;
      await editFile(
        `${this.absoluteProjectPath}/${this.inputPbxprojFile}`,
        `${this.absoluteProjectPath}/${this.tempFile}`,
        (line) => {
          let isShellScriptLine = false;
          if (line.match('name = "Bundle React Native code and images"')) {
            isInRNBuildPhaseBlock = true;
          }
          if (isInRNBuildPhaseBlock) {
            if (line.match("shellScript =")) {
              isShellScriptLine = true;
            }
          }
          if (isInRNBuildPhaseBlock && isShellScriptLine) {
            isInRNBuildPhaseBlock = false;
            return this.getLineToWrite(line, {
              isInRNBuildPhaseBlock: true,
              isShellScriptLine,
            });
          }
          return this.getLineToWrite(line, {
            isInRNBuildPhaseBlock,
            isShellScriptLine,
          });
        }
      );

      return new Promise<void>((resolve, reject) => {
        rename(
          `${this.absoluteProjectPath}/${this.tempFile}`,
          `${this.absoluteProjectPath}/${this.outputPbxprojFile}`,
          (error) => {
            if (error) {
              reject(error);
            }
            resolve();
          }
        );
      });
    } catch (error) {
      unlinkSync(`${this.absoluteProjectPath}/${this.tempFile}`);
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

import { editFile } from "../../utils/edit-file";

export abstract class XCodeBuildPhaseEditor {
  protected absoluteProjectPath: string;
  protected inputPbxprojFile: string;
  protected outputPbxprojFile: string;

  constructor(options: {
    absoluteProjectPath: string;
    inputPbxprojFile: string;
    outputPbxprojFile: string;
  }) {
    this.absoluteProjectPath = options.absoluteProjectPath;
    this.inputPbxprojFile = options.inputPbxprojFile;
    this.outputPbxprojFile = options.outputPbxprojFile;
  }

  protected abstract getNewShellScript: (line: string) => string;

  public abstract editBuildPhase: () => Promise<void>;

  protected injectDatadogIntoProjectPbxproj = async () => {
    let isInRNBuildPhaseBlock = false;
    await editFile(
      `${this.absoluteProjectPath}/${this.inputPbxprojFile}`,
      `${this.absoluteProjectPath}/${this.outputPbxprojFile}`,
      (line) => {
        if (line.match('name = "Bundle React Native code and images"')) {
          isInRNBuildPhaseBlock = true;
        }

        if (isInRNBuildPhaseBlock && line.match("shellScript =")) {
          isInRNBuildPhaseBlock = false;

          return this.getLineToWrite(line, {
            isBundleShellScriptLine: true,
          });
        }

        return this.getLineToWrite(line, {
          isBundleShellScriptLine: false,
        });
      }
    );
  };

  private getLineToWrite = (
    line: string,
    params: { isBundleShellScriptLine: boolean }
  ) => {
    if (!params.isBundleShellScriptLine) {
      return line;
    }
    return this.getNewShellScript(line);
  };
}

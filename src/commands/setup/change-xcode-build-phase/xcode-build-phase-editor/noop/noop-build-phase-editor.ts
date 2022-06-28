import { XCodeBuildPhaseEditor } from "../xcode-build-phase-editor";

export class NoopBuildPhaseEditor extends XCodeBuildPhaseEditor {
  public editBuildPhase = () => {
    return this.injectDatadogIntoProjectPbxproj();
  };

  protected getNewShellScript = (line: string) => line;
}

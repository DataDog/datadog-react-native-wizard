import { XCodeBuildPhaseEditor } from "../xcode-build-phase-editor";

export class NoopBuildPhaseEditor extends XCodeBuildPhaseEditor {
  protected getNewShellScript = (line: string) => line;
}

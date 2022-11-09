import { makeFileExecutable } from "../../../utils/make-file-executable";
import { editFile } from "../../../utils/edit-file";
import { XCodeBuildPhaseEditor } from "../xcode-build-phase-editor";

/**
 * This script is supporting versions of React Native from 0.69.
 *
 * The goal is to keep all the things inside the script (like custom env variables), and replace
 * the script by our script.
 *
 * We also need to create a script file, so we ask the user about the ideal location.
 */
export class RN69BuildPhaseEditor extends XCodeBuildPhaseEditor {
  private datadogScriptLocation: string = `${this.absoluteProjectPath}/ios/datadog-sourcemaps.sh`;

  public editBuildPhase = async () => {
    await this.addDatadogScript();
    return this.injectDatadogIntoProjectPbxproj();
  };

  private addDatadogScript = async () => {
    await editFile(
      `${__dirname}/datadog-sourcemaps.sh.template`,
      this.datadogScriptLocation,
      (line: string) => {
        return line
          .replace("{{nodeBin}}", this.nodeBin)
          .replace("{{packageManagerBin}}", this.packageManagerBin)
          .replace("{{packageManager}}", this.packageManager);
      }
    );
    return makeFileExecutable(this.datadogScriptLocation);
  };

  protected getNewShellScript = (line: string) => {
    const [beforeScript, afterScript] = line.split(
      `REACT_NATIVE_XCODE=\\"../node_modules/react-native/scripts/react-native-xcode.sh\\"`
    );
    const datadogScript = `REACT_NATIVE_XCODE=\\"./datadog-sourcemaps.sh\\"\\nexport SOURCEMAP_FILE=./build/main.jsbundle.map\\n`;

    return `${beforeScript}${datadogScript}${afterScript}`;
  };
}

import { makeFileExecutable } from "../../../utils/make-file-executable";
import { editFile } from "../../../utils/edit-file";
import { XCodeBuildPhaseEditor } from "../xcode-build-phase-editor";

/**
 * This is the script we need to replace from RN 0.69 to RN 0.73 (included).
 */
const RN69_SCRIPT = `REACT_NATIVE_XCODE=\\"../node_modules/react-native/scripts/react-native-xcode.sh\\"`;

/**
 * This is the script we need to replace starting from RN 0.74.
 */
const RN74_SCRIPT = `REACT_NATIVE_XCODE=\\"$REACT_NATIVE_PATH/scripts/react-native-xcode.sh\\"`;

/**
 * This script is supporting versions of React Native from 0.69.
 *
 * The goal is to keep all the things inside the script (like custom env variables), and replace
 * the script by our script.
 *
 * We also need to create a script file, so we ask the user about the ideal location.
 */
export class RN69BuildPhaseEditor extends XCodeBuildPhaseEditor {
  private minorRNVersion: number;

  constructor(
    options: {
      absoluteProjectPath: string;
      inputPbxprojFile: string;
      outputPbxprojFile: string;
    },
    otherOptions: {
      minorRNVersion: number;
    }
  ) {
    super(options);
    this.minorRNVersion = otherOptions.minorRNVersion;
  }

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
        // we only copy the file
        return line;
      }
    );
    return makeFileExecutable(this.datadogScriptLocation);
  };

  protected getNewShellScript = (line: string) => {
    const [beforeScript, afterScript] = line.split(
      this.minorRNVersion < 74 ? RN69_SCRIPT : RN74_SCRIPT
    );
    const datadogScript = `REACT_NATIVE_XCODE=\\"./datadog-sourcemaps.sh\\"\\nexport SOURCEMAP_FILE=$DERIVED_FILE_DIR/main.jsbundle.map\\n`;

    return `${beforeScript}${datadogScript}${afterScript}`;
  };
}

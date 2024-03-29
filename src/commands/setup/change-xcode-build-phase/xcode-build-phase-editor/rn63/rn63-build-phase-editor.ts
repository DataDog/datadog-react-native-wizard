import { XCodeBuildPhaseEditor } from "../xcode-build-phase-editor";

/**
 * This script is supporting versions of React Native from 0.63 to 0.69.
 * It may work on earlier versions, but have not been tested.
 *
 * The goal is to keep all the things inside the script (like custom env variables), and replace
 * the script by our script.
 */
export class RN63BuildPhaseEditor extends XCodeBuildPhaseEditor {
  public editBuildPhase = () => {
    return this.injectDatadogIntoProjectPbxproj();
  };

  protected getNewShellScript = (line: string) => {
    const [beforeScript, afterScript] = line.split(
      "../node_modules/react-native/scripts/react-native-xcode.sh"
    );
    const datadogScript = `export SOURCEMAP_FILE=$DERIVED_FILE_DIR/main.jsbundle.map\\n../node_modules/.bin/datadog-ci react-native xcode`;
    return `${beforeScript}${datadogScript}${afterScript}`;
  };
}

import { XCodeBuildPhaseEditor } from "../xcode-build-phase-editor";

/**
 * The goal is to keep all the things inside the script (like custom env variables), and replace
 * the script by our script.
 */
export class RN63BuildPhaseEditor extends XCodeBuildPhaseEditor {
  protected getNewShellScript = (line: string) => {
    const [beforeScript, afterScript] = line.split(
      "../node_modules/react-native/scripts/react-native-xcode.sh"
    );
    const datadogScript = `export SOURCEMAP_FILE=./build/main.jsbundle.map\\n${this.nodeBin} ${this.packageManagerBin} datadog-ci react-native xcode node_modules/react-native/scripts/react-native-xcode.sh`;
    return `${beforeScript}${datadogScript}${afterScript}`;
  };
}

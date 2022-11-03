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
    const datadogScript = `# If the build runs from XCode, we cannot use ${this.packageManager}.\\n# Therefore we need to check first which ${this.packageManager} command is appropriate\\npackage_manager_test_command=\\"bin\\" # both \`yarn bin\` and \`npm bin\` are valid commands\\ntest_and_set_package_manager_bin()\\n{\\n  $(echo $1 $package_manager_test_command) && export PACKAGE_MANAGER_BIN=$1\\n}\\n \\ntest_and_set_package_manager_bin \\"${this.packageManager}\\" ||\\ntest_and_set_package_manager_bin \\"${this.nodeBin} ${this.packageManagerBin}\\" ||\\necho \\"package manager not found\\"\\n\\nexport SOURCEMAP_FILE=./build/main.jsbundle.map\\n$(echo $PACKAGE_MANAGER_BIN datadog-ci react-native xcode)`;
    return `${beforeScript}${datadogScript}${afterScript}`;
  };
}

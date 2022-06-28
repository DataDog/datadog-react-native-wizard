import events from "events";
import { createReadStream, createWriteStream } from "fs";
import readline from "readline";
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
  private datadogScriptLocation: string = `${process.cwd()}/${
    this.absoluteProjectPath
  }/ios/datadog-sourcemaps.sh`;

  public editBuildPhase = () => {
    this.addDatadogScript();
    return this.injectDatadogIntoProjectPbxproj();
  };

  private addDatadogScript = async () => {
    const lineReader = readline.createInterface({
      input: createReadStream(`${__dirname}/datadog-sourcemaps.sh.template`),
    });

    const writer = createWriteStream(this.datadogScriptLocation, {
      flags: "a",
    });

    lineReader.on("line", (line) => {
      const newLine = line
        .replace("{{nodeBin}}", this.nodeBin)
        .replace("{{packageManagerBin}}", this.packageManagerBin);
      writer.write(`${newLine}\n`);
    });

    await events.once(lineReader, "close");
  };

  protected getNewShellScript = (line: string) => {
    const [beforeScript, afterScript] = line.split(
      `REACT_NATIVE_XCODE=\\"../node_modules/react-native/scripts/react-native-xcode.sh\\"`
    );
    const datadogScript = `REACT_NATIVE_XCODE=\\"./datadog-sourcemaps.sh\\"\\nexport SOURCEMAP_FILE=./build/main.jsbundle.map\\n`;

    return `${beforeScript}${datadogScript}${afterScript}`;
  };
}

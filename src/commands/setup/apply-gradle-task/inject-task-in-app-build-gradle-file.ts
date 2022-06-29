import { EOL } from "os";
import { editFile } from "../utils/edit-file";

export const injectTaskInAppBuildGradleFile = (
  androidAppBuildGradleInputFile: string,
  androidAppBuildGradleOutputFile: string
) => {
  return editFile(
    androidAppBuildGradleInputFile,
    androidAppBuildGradleOutputFile,
    (line: string) => {
      if (
        line.match(
          /^apply from: "..\/..\/node_modules\/react-native\/react.gradle"/
        )
      ) {
        return `${line}${EOL}apply from: "../../node_modules/@datadog/mobile-react-native/datadog-sourcemaps.gradle"`;
      }

      return line;
    }
  );
};

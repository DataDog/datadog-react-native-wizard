import { EOL } from "os";
import { DependencyVersion } from "../utils/dependency-utils";
import { editFile } from "../utils/edit-file";

const INJECTION_LINE_BY_VERSION = {
  latest: /^apply plugin: "com.facebook.react"/,
  70: /^apply from: "..\/..\/node_modules\/react-native\/react.gradle"/,
};

const getInjectionLine = (reactNativeVersion: DependencyVersion) => {
  if (reactNativeVersion.minor < 71) {
    return INJECTION_LINE_BY_VERSION[70];
  }

  return INJECTION_LINE_BY_VERSION.latest;
};

export const injectTaskInAppBuildGradleFile = (
  androidAppBuildGradleInputFile: string,
  androidAppBuildGradleOutputFile: string,
  parameters: { reactNativeVersion: DependencyVersion }
) => {
  return editFile(
    androidAppBuildGradleInputFile,
    androidAppBuildGradleOutputFile,
    (line: string) => {
      if (line.match(getInjectionLine(parameters.reactNativeVersion))) {
        return `${line}${EOL}apply from: "../../node_modules/@datadog/mobile-react-native/datadog-sourcemaps.gradle"`;
      }

      return line;
    }
  );
};

import { DatadogCoreTooOldError } from "../errors";
import {
  getDatadogVersion,
  getRNVersion,
  isDependencyVersionOver,
} from "../utils/dependency-utils";
import { injectTaskInAppBuildGradleFile } from "./inject-task-in-app-build-gradle-file";

export const applyGradleTask = (absoluteProjectPath: string) => {
  const datadogVersion = getDatadogVersion(absoluteProjectPath);
  if (!isDependencyVersionOver(datadogVersion, "1.0.0")) {
    throw new DatadogCoreTooOldError(
      "@datadog/mobile-react-native is too old and does not contain the gradle task file."
    );
  }

  const androidAppBuildGradleFile = `${absoluteProjectPath}/android/app/build.gradle`;
  return injectTaskInAppBuildGradleFile(
    androidAppBuildGradleFile,
    androidAppBuildGradleFile,
    { reactNativeVersion: getRNVersion(absoluteProjectPath) }
  );
};

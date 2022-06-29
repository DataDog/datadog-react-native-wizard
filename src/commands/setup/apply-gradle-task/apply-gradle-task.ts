import { injectTaskInAppBuildGradleFile } from "./inject-task-in-app-build-gradle-file";

export const applyGradleTask = (absoluteProjectPath: string) => {
  const androidAppBuildGradleFile = `${absoluteProjectPath}/android/app/build.gradle`;
  return injectTaskInAppBuildGradleFile(
    androidAppBuildGradleFile,
    androidAppBuildGradleFile
  );
};

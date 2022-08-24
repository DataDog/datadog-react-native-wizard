import { askIsObfuscationEnabled } from "./ask-is-obfuscation-enabled";
import { injectPluginInBuildGradle } from "./inject-plugin-in-build-gradle";

export const applyGradlePlugin = async (absoluteProjectPath: string) => {
  const isObfuscationEnabled = await askIsObfuscationEnabled();
  if (!isObfuscationEnabled) {
    return;
  }

  const androidAppBuildGradleFile = `${absoluteProjectPath}/android/app/build.gradle`;
  await injectPluginInBuildGradle(
    androidAppBuildGradleFile,
    androidAppBuildGradleFile
  );
};

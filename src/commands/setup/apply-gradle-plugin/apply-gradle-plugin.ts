import { Store } from "../../../utils/StepsCommand/Store";
import { DatadogSite } from "../interface";
import { askIsObfuscationEnabled } from "./ask-is-obfuscation-enabled";
import { injectPluginInBuildGradle } from "./inject-plugin-in-build-gradle";

export const applyGradlePlugin = async (
  absoluteProjectPath: string,
  store: Store<{ datadogSite?: DatadogSite }>
) => {
  const isObfuscationEnabled = await askIsObfuscationEnabled();
  if (!isObfuscationEnabled) {
    return;
  }

  const androidAppBuildGradleFile = `${absoluteProjectPath}/android/app/build.gradle`;
  await injectPluginInBuildGradle(
    androidAppBuildGradleFile,
    androidAppBuildGradleFile,
    store.get()
  );
};

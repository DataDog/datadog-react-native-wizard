import { Store } from "../../../utils/StepsCommand/Store";
import { askIsObfuscationEnabled } from "./ask-is-obfuscation-enabled";
import { injectPluginInBuildGradle } from "./inject-plugin-in-build-gradle";

export const applyGradlePlugin = async (
  absoluteProjectPath: string,
  store: Store<{
    androidMinificationEnabled?: boolean;
    bypassPrompts: boolean;
  }>
) => {
  const isObfuscationEnabled = await getIsObfuscationEnabled(store);
  if (!isObfuscationEnabled) {
    return;
  }

  const androidAppBuildGradleFile = `${absoluteProjectPath}/android/app/build.gradle`;
  await injectPluginInBuildGradle(
    androidAppBuildGradleFile,
    androidAppBuildGradleFile
  );
};

const getIsObfuscationEnabled = async (
  store: Store<{
    androidMinificationEnabled?: boolean;
    bypassPrompts: boolean;
  }>
): Promise<boolean> => {
  if (store.get().bypassPrompts) {
    return new Promise((resolve) =>
      resolve(!!store.get().androidMinificationEnabled)
    );
  }

  return await askIsObfuscationEnabled();
};

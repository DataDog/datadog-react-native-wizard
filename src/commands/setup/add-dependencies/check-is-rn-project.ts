import { ReactNativeProjectError } from "../errors";

export const checkIsRNProject = (
  currentWorkingDirectory: string = process.cwd()
) => {
  try {
    const packageJSON = require(`${currentWorkingDirectory}/package.json`);
    const RNVersion = packageJSON.dependencies["react-native"];

    if (!RNVersion) {
      throw new Error("No RN version in package.json");
    }
  } catch (error) {
    throw new ReactNativeProjectError((error as Error).message);
  }
};

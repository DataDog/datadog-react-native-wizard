import { ReactNativeProjectError } from "../errors";
import { getRNVersion } from "../utils/dependency-utils";

export const checkIsRNProject = (absoluteProjectPath: string) => {
  try {
    getRNVersion(absoluteProjectPath);
  } catch (error) {
    throw new ReactNativeProjectError((error as Error).message);
  }
};

import { ReactNativeProjectError } from "../errors";
import { getRNVersion } from "../utils/get-rn-version";

export const checkIsRNProject = (projectPath: string) => {
  try {
    getRNVersion(projectPath);
  } catch (error) {
    throw new ReactNativeProjectError((error as Error).message);
  }
};

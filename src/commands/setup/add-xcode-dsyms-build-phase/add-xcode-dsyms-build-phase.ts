import { getProjectPbxprojFile } from "../utils/get-project-pbxproj-file";
import { injectDsymsBuildPhase } from "./inject-dsyms-build-phase";

export const addXCodeDsymsBuildPhase = async (absoluteProjectPath: string) => {
  const pbxprojFile = getProjectPbxprojFile(absoluteProjectPath);

  await injectDsymsBuildPhase({
    absoluteProjectPath,
    inputPbxprojFile: pbxprojFile,
    outputPbxprojFile: pbxprojFile,
  });
};

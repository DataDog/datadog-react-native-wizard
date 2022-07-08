import { getBin } from "../utils/get-bin";
import { getPackageManager } from "../utils/get-package-manager";
import { getProjectPbxprojFile } from "../utils/get-project-pbxproj-file";
import { injectDsymsBuildPhase } from "./inject-dsyms-build-phase";

export const addXCodeDsymsBuildPhase = async (absoluteProjectPath: string) => {
  const packageManager = getPackageManager(absoluteProjectPath);
  const pbxprojFile = getProjectPbxprojFile(absoluteProjectPath);

  await injectDsymsBuildPhase({
    packageManagerBin: await getBin(packageManager),
    nodeBin: await getBin("node"),
    absoluteProjectPath,
    inputPbxprojFile: pbxprojFile,
    outputPbxprojFile: pbxprojFile,
  });
};

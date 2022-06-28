import {
  getPackageManager,
  PackageManager,
} from "../utils/get-package-manager";
import { DependencyVersion, getRNVersion } from "../utils/get-rn-version";
import { getBin } from "./get-bin";
import { getProjectPbxprojFile } from "./get-project-pbxproj-file";
import { RN63BuildPhaseEditor } from "./xcode-build-phase-editor/rn63/rn63-build-phase-editor";
import { RN69BuildPhaseEditor } from "./xcode-build-phase-editor/rn69/rn69-build-phase-editor";

export const changeXCodeBuildPhase = async (projectPath: string) => {
  const RNVersion = getRNVersion(projectPath);
  const packageManager = getPackageManager(projectPath);
  const pbxprojFile = getProjectPbxprojFile(projectPath);
  const buildPhaseEditor = await getBuildPhaseEditor({
    RNVersion,
    packageManager,
    projectPath,
    pbxprojFile,
  });

  await buildPhaseEditor.editBuildPhase();
};

const getBuildPhaseEditor = async (params: {
  RNVersion: DependencyVersion;
  packageManager: PackageManager;
  projectPath: string;
  pbxprojFile: string;
}) => {
  if (params.RNVersion.minor < 69) {
    return new RN63BuildPhaseEditor({
      packageManagerBin: await getBin(params.packageManager),
      nodeBin: await getBin("node"),
      projectPath: params.projectPath,
      inputPbxprojFile: params.pbxprojFile,
      outputPbxprojFile: params.pbxprojFile,
    });
  }
  return new RN69BuildPhaseEditor({
    packageManagerBin: await getBin(params.packageManager),
    nodeBin: await getBin("node"),
    projectPath: params.projectPath,
    inputPbxprojFile: params.pbxprojFile,
    outputPbxprojFile: params.pbxprojFile,
  });
};

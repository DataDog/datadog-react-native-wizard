import {
  getPackageManager,
  PackageManager,
} from "../utils/get-package-manager";
import { DependencyVersion, getRNVersion } from "../utils/dependency-utils";
import { getBin } from "./get-bin";
import { getProjectPbxprojFile } from "./get-project-pbxproj-file";
import { RN63BuildPhaseEditor } from "./xcode-build-phase-editor/rn63/rn63-build-phase-editor";
import { RN69BuildPhaseEditor } from "./xcode-build-phase-editor/rn69/rn69-build-phase-editor";

export const changeXCodeBuildPhase = async (absoluteProjectPath: string) => {
  const RNVersion = getRNVersion(absoluteProjectPath);
  const packageManager = getPackageManager(absoluteProjectPath);
  const pbxprojFile = getProjectPbxprojFile(absoluteProjectPath);
  const buildPhaseEditor = await getBuildPhaseEditor({
    RNVersion,
    packageManager,
    absoluteProjectPath,
    pbxprojFile,
  });

  await buildPhaseEditor.editBuildPhase();
};

const getBuildPhaseEditor = async (params: {
  RNVersion: DependencyVersion;
  packageManager: PackageManager;
  absoluteProjectPath: string;
  pbxprojFile: string;
}) => {
  if (params.RNVersion.minor < 69) {
    return new RN63BuildPhaseEditor({
      packageManagerBin: await getBin(params.packageManager),
      nodeBin: await getBin("node"),
      absoluteProjectPath: params.absoluteProjectPath,
      inputPbxprojFile: params.pbxprojFile,
      outputPbxprojFile: params.pbxprojFile,
    });
  }
  return new RN69BuildPhaseEditor({
    packageManagerBin: await getBin(params.packageManager),
    nodeBin: await getBin("node"),
    absoluteProjectPath: params.absoluteProjectPath,
    inputPbxprojFile: params.pbxprojFile,
    outputPbxprojFile: params.pbxprojFile,
  });
};

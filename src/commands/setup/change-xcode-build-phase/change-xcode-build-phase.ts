import { DependencyVersion, getRNVersion } from "../utils/dependency-utils";
import { getProjectPbxprojFile } from "../utils/get-project-pbxproj-file";
import { RN63BuildPhaseEditor } from "./xcode-build-phase-editor/rn63/rn63-build-phase-editor";
import { RN69BuildPhaseEditor } from "./xcode-build-phase-editor/rn69/rn69-build-phase-editor";

export const changeXCodeBuildPhase = async (absoluteProjectPath: string) => {
  const RNVersion = getRNVersion(absoluteProjectPath);
  const pbxprojFile = getProjectPbxprojFile(absoluteProjectPath);
  const buildPhaseEditor = await getBuildPhaseEditor({
    RNVersion,
    absoluteProjectPath,
    pbxprojFile,
  });

  await buildPhaseEditor.editBuildPhase();
};

const getBuildPhaseEditor = async (params: {
  RNVersion: DependencyVersion;
  absoluteProjectPath: string;
  pbxprojFile: string;
}) => {
  if (params.RNVersion.minor < 69) {
    return new RN63BuildPhaseEditor({
      absoluteProjectPath: params.absoluteProjectPath,
      inputPbxprojFile: params.pbxprojFile,
      outputPbxprojFile: params.pbxprojFile,
    });
  }
  return new RN69BuildPhaseEditor(
    {
      absoluteProjectPath: params.absoluteProjectPath,
      inputPbxprojFile: params.pbxprojFile,
      outputPbxprojFile: params.pbxprojFile,
    },
    { minorRNVersion: params.RNVersion.minor }
  );
};

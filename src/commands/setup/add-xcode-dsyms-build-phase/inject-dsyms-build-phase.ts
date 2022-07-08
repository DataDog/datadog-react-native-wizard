import { writeFileSync } from "fs";
import { project } from "xcode";

export const injectDsymsBuildPhase = async (params: {
  packageManagerBin: string;
  nodeBin: string;
  absoluteProjectPath: string;
  inputPbxprojFile: string;
  outputPbxprojFile: string;
}) => {
  const xcodeProject = project(
    `${params.absoluteProjectPath}/${params.inputPbxprojFile}`
  );

  return new Promise((resolve, reject) => {
    xcodeProject.parse((error: unknown) => {
      debugger;
      if (error) {
        reject(error);
      }

      xcodeProject.addBuildPhase(
        [],
        "PBXShellScriptBuildPhase",
        "Upload dSYMs to Datadog",
        null /* target */,
        {
          shellScript: `set -e\\n${params.nodeBin} ${params.packageManagerBin} datadog-ci dsyms upload $DWARF_DSYM_FOLDER_PATH`,
        }
      );

      writeFileSync(
        `${params.absoluteProjectPath}/${params.outputPbxprojFile}`,
        xcodeProject.writeSync()
      );

      resolve(undefined);
    });
  });
};

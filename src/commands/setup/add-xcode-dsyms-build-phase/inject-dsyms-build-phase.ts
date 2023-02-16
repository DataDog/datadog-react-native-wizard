import { writeFileSync } from "fs";
import { project } from "xcode";

export const injectDsymsBuildPhase = async (params: {
  absoluteProjectPath: string;
  inputPbxprojFile: string;
  outputPbxprojFile: string;
}) => {
  const xcodeProject = project(
    `${params.absoluteProjectPath}/${params.inputPbxprojFile}`
  );

  return new Promise((resolve, reject) => {
    xcodeProject.parse((error: unknown) => {
      if (error) {
        reject(error);
      }

      xcodeProject.addBuildPhase(
        [],
        "PBXShellScriptBuildPhase",
        "Upload dSYMs to Datadog",
        null /* target */,
        {
          shellScript: `set -e\\n../node_modules/.bin/datadog-ci dsyms upload $DWARF_DSYM_FOLDER_PATH`,
          shellPath: "/bin/sh",
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

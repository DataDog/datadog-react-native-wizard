import { readdirSync } from "fs";

export const getProjectPbxprojFile = (projectPath: string): string => {
  const xcodeProjName = readdirSync(`${process.cwd()}/${projectPath}/ios`).find(
    (element) => element.match(".xcodeproj")
  );
  return `ios/${xcodeProjName}/project.pbxproj`;
};

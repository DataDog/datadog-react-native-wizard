import { readdirSync } from "fs";

export const getProjectPbxprojFile = (absoluteProjectPath: string): string => {
  const xcodeProjName = readdirSync(`${absoluteProjectPath}/ios`).find(
    (element) => element.match(".xcodeproj")
  );
  return `ios/${xcodeProjName}/project.pbxproj`;
};

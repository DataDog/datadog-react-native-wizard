import { getProjectPbxprojFile } from "../get-project-pbxproj-file";

describe("getProjectPbxprojFile", () => {
  it("returns the path to the project.pbxproj", () => {
    expect(
      getProjectPbxprojFile(
        "./src/commands/setup/utils/__tests__/fixtures/project"
      )
    ).toBe("ios/MyApp.xcodeproj/project.pbxproj");
  });
});

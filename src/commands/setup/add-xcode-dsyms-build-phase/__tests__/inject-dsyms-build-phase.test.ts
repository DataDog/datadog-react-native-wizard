import { unlinkSync } from "fs";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { injectDsymsBuildPhase } from "../inject-dsyms-build-phase";

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("B44874951D56467AACF7EFAA"),
}));

const fixturesPath = getAbsolutePath(
  "src/commands/setup/add-xcode-dsyms-build-phase/__tests__/fixtures"
);
const resultsPath = getAbsolutePath(
  "src/commands/setup/add-xcode-dsyms-build-phase/__tests__/results"
);

const testFilePath = "project.pbxproj.log";

afterEach(() => {
  try {
    unlinkSync(`${fixturesPath}/${testFilePath}`);
  } catch (error) {
    console.log(error);
  }
});

describe("injectDsymsBuildPhase", () => {
  it("injects the dsyms upload build phase in the project pbxproj", async () => {
    await injectDsymsBuildPhase({
      absoluteProjectPath: fixturesPath,
      inputPbxprojFile: "project.pbxproj",
      outputPbxprojFile: "project.pbxproj.log",
    });

    // @ts-ignore
    expect(`${fixturesPath}/${testFilePath}`).toMatchFile(
      `${resultsPath}/project.pbxproj`
    );
  });
});

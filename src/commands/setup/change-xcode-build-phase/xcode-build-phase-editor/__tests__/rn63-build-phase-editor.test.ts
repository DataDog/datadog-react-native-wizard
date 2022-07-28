import { unlinkSync } from "fs";
import { getAbsolutePath } from "../../../__test-utils__/get-absolute-path";
import { RN63BuildPhaseEditor } from "../rn63/rn63-build-phase-editor";

const fixturesPath = getAbsolutePath(
  "./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/fixtures"
);
const testFile = "rn63.pbxproj.log";

afterEach(() => {
  try {
    unlinkSync(`${fixturesPath}/${testFile}`);
  } catch (error) {
    console.log(error);
  }
});

describe("RN63BuildPhaseEditor", () => {
  it("modifies the pbxproj file", async () => {
    const rn63BuildPhaseEditor = new RN63BuildPhaseEditor({
      packageManager: "yarn",
      packageManagerBin: "/opt/homebrew/bin/yarn",
      nodeBin: "/opt/homebrew/bin/node",
      absoluteProjectPath: fixturesPath,
      outputPbxprojFile: testFile,
      inputPbxprojFile: "rn68.project.pbxproj",
    });

    await rn63BuildPhaseEditor.editBuildPhase();

    // @ts-ignore
    expect(`${fixturesPath}/${testFile}`).toMatchFile(
      `./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/results/rn68.project.pbxproj`
    );
  });
});

import { unlinkSync } from "fs";
import { NoopBuildPhaseEditor } from "../noop/noop-build-phase-editor";

const fixturesPath =
  "./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/fixtures";
const testFile = "noop.pbxproj.log";

afterEach(() => {
  try {
    unlinkSync(`${fixturesPath}/${testFile}`);
  } catch (error) {
    console.log(error);
  }
});

describe("NoopBuildPhaseEditor", () => {
  it("copies the pbxproj file", async () => {
    const noopBuildPhaseEditor = new NoopBuildPhaseEditor({
      packageManagerBin: "",
      nodeBin: "",
      projectPath: fixturesPath,
      outputPbxprojFile: testFile,
      inputPbxprojFile: "rn68.project.pbxproj",
    });

    await noopBuildPhaseEditor.editBuildPhase();

    // @ts-ignore
    expect(`${fixturesPath}/${testFile}`).toMatchFile(
      `${fixturesPath}/rn68.project.pbxproj`
    );
  });
});

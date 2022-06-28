import { readFileSync, unlinkSync } from "fs";
import { NoopBuildPhaseEditor } from "../noop/noop-build-phase-editor";

const fixturesPath =
  "./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/fixtures";
const testFile = "noop.pbxproj.log";

afterEach(() => {
  unlinkSync(`${fixturesPath}/${testFile}`);
});

describe("NoopBuildPhaseEditor", () => {
  it("copies the pbxproj file", async () => {
    const noopBuildPhaseEditor = new NoopBuildPhaseEditor({
      packageManagerBin: "",
      nodeBin: "",
      projectPath: fixturesPath,
      outputFile: testFile,
      pbxprojFile: "rn68.project.pbxproj",
    });

    await noopBuildPhaseEditor.injectDatadogIntoProject();

    var expectedFile = readFileSync(`${fixturesPath}/rn68.project.pbxproj`);
    var writtenFile = readFileSync(`${fixturesPath}/${testFile}`);

    expect(writtenFile).toEqual(expectedFile);
  });
});

import { unlinkSync } from "fs";
import { getAbsolutePath } from "../../../__test-utils__/get-absolute-path";
import { RN69BuildPhaseEditor } from "../rn69/rn69-build-phase-editor";

const fixturesPath = getAbsolutePath(
  "./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/fixtures"
);
const testFile = "rn69.pbxproj.log";

afterEach(() => {
  try {
    unlinkSync(`${fixturesPath}/${testFile}`);
    unlinkSync(`${fixturesPath}/ios/datadog-sourcemaps.sh`);
  } catch (error) {
    console.log(error);
  }
});

describe("RN69BuildPhaseEditor", () => {
  it("modifies the pbxproj file", async () => {
    const rn69BuildPhaseEditor = new RN69BuildPhaseEditor(
      {
        absoluteProjectPath: fixturesPath,
        outputPbxprojFile: testFile,
        inputPbxprojFile: "rn69.project.pbxproj",
      },
      { minorRNVersion: 69 }
    );

    await rn69BuildPhaseEditor.editBuildPhase();

    // @ts-ignore
    expect(`${fixturesPath}/${testFile}`).toMatchFile(
      `./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/results/rn69.project.pbxproj`
    );

    // @ts-ignore
    expect(`${fixturesPath}/ios/datadog-sourcemaps.sh`).toMatchFile(
      `./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/results/datadog-sourcemaps.sh`
    );
  });

  it("modifies the pbxproj file for RN 0.74", async () => {
    const rn69BuildPhaseEditor = new RN69BuildPhaseEditor(
      {
        absoluteProjectPath: fixturesPath,
        outputPbxprojFile: testFile,
        inputPbxprojFile: "rn74.project.pbxproj",
      },
      { minorRNVersion: 74 }
    );

    await rn69BuildPhaseEditor.editBuildPhase();

    // @ts-ignore
    expect(`${fixturesPath}/${testFile}`).toMatchFile(
      `./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/results/rn74.project.pbxproj`
    );

    // @ts-ignore
    expect(`${fixturesPath}/ios/datadog-sourcemaps.sh`).toMatchFile(
      `./src/commands/setup/change-xcode-build-phase/xcode-build-phase-editor/__tests__/results/datadog-sourcemaps.sh`
    );
  });
});

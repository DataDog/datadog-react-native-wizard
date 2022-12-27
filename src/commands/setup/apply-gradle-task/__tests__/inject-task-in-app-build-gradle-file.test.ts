import { unlinkSync } from "fs";
import { getRNVersion } from "../../utils/dependency-utils";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { injectTaskInAppBuildGradleFile } from "../inject-task-in-app-build-gradle-file";

const fixturesPath = `src/commands/setup/apply-gradle-task/__tests__/fixtures`;
const outputBuildGradle = getAbsolutePath(`${fixturesPath}/build.gradle.log`);

afterEach(() => {
  try {
    unlinkSync(outputBuildGradle);
  } catch (error) {
    console.log(error);
  }
});

describe("injectTaskInAppBuildGradleFile", () => {
  it("edits the app/build.gradle file when React Native version is 0.69", async () => {
    await injectTaskInAppBuildGradleFile(
      getAbsolutePath(`${fixturesPath}/build.rn69.gradle`),
      outputBuildGradle,
      { reactNativeVersion: { major: 0, minor: 69, patch: "0" } }
    );
    // @ts-ignore
    expect(outputBuildGradle).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-task/__tests__/results/build.rn69.gradle"
      )
    );
  });

  it("edits the app/build.gradle file when React Native version is 0.71", async () => {
    await injectTaskInAppBuildGradleFile(
      getAbsolutePath(`${fixturesPath}/build.rn71.gradle`),
      outputBuildGradle,
      { reactNativeVersion: { major: 0, minor: 71, patch: "0" } }
    );
    // @ts-ignore
    expect(outputBuildGradle).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-task/__tests__/results/build.rn71.gradle"
      )
    );
  });
});

import { unlinkSync } from "fs";
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
  it("edits the app/build.gradle file", async () => {
    await injectTaskInAppBuildGradleFile(
      getAbsolutePath(`${fixturesPath}/build.gradle`),
      outputBuildGradle
    );
    // @ts-ignore
    expect(outputBuildGradle).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-task/__tests__/results/build.gradle"
      )
    );
  });
});

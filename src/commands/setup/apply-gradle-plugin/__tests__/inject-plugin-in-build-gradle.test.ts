import { unlinkSync } from "fs";
import { GradlePluginNotAutomated } from "../../errors";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { injectPluginInBuildGradle } from "../inject-plugin-in-build-gradle";

const testFilePath = getAbsolutePath(
  "src/commands/setup/apply-gradle-plugin/__tests__/build.gradle.log"
);

afterEach(() => {
  try {
    unlinkSync(testFilePath);
  } catch (error) {
    console.log(error);
  }
});

describe("injectPluginInBuildGradle", () => {
  it("injects the plugin and correct configuration", async () => {
    await injectPluginInBuildGradle(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/build.gradle"
      ),
      testFilePath
    );

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/results/us.build.gradle"
      )
    );
  });

  it("throws an error if the plugin could not be automated", async () => {
    await expect(
      injectPluginInBuildGradle(
        getAbsolutePath(
          "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/no-variant-loop.build.gradle"
        ),
        testFilePath
      )
    ).rejects.toThrowError(GradlePluginNotAutomated);
  });
});

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

  it("adds an application variant loop if not present in RN >= 0.72", async () => {
    await injectPluginInBuildGradle(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/rn72.build.gradle"
      ),
      testFilePath
    );

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/results/us.rn72.build.gradle"
      )
    );
  });

  it("adds an application variant loop if not present in RN < 0.72", async () => {
    await injectPluginInBuildGradle(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/no-variant-loop.build.gradle"
      ),
      testFilePath
    );

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/results/us.no-variant-loop.build.gradle"
      )
    );
  });

  it("throws an error if the android closure is not present", async () => {
    await expect(
      injectPluginInBuildGradle(
        getAbsolutePath(
          "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/no-android-closure.build.gradle"
        ),
        testFilePath
      )
    ).rejects.toThrowError(GradlePluginNotAutomated);
  });
});

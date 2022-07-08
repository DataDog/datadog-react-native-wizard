import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { injectPluginInBuildGradle } from "../inject-plugin-in-build-gradle";

const testFilePath = getAbsolutePath(
  "src/commands/setup/apply-gradle-plugin/__tests__/build.gradle.log"
);

describe("injectPluginInBuildGradle", () => {
  it("injects the plugin and correct configuration with US site", async () => {
    await injectPluginInBuildGradle(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/build.gradle"
      ),
      testFilePath,
      { datadogSite: "US" }
    );

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/results/us.build.gradle"
      )
    );
  });

  it("injects the plugin and correct configuration with no site", async () => {
    await injectPluginInBuildGradle(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/fixtures/build.gradle"
      ),
      testFilePath,
      {}
    );

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/apply-gradle-plugin/__tests__/results/no-site.build.gradle"
      )
    );
  });
});

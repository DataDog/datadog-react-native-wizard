import { Cli } from "clipanion";
import { copyFileSync, unlinkSync } from "fs";
import { SetupCommand } from "../setup";
import { getAbsolutePath } from "../__test-utils__/get-absolute-path";

jest.mock("../create-properties-files/get-properties-data", () => ({
  getPropertiesData: () => {
    return new Promise((resolve) =>
      resolve({
        apiKey: "api-key",
      })
    );
  },
}));

const makeCli = () => {
  const cli = new Cli();
  cli.register(SetupCommand);

  return cli;
};

const absoluteProjectPath = getAbsolutePath(
  "./src/commands/setup/__tests__/fixtures/project"
);

afterEach(() => {
  try {
    unlinkSync(`${absoluteProjectPath}/ios/datadog-sourcemaps.sh`);
    unlinkSync(`${absoluteProjectPath}/datadog-sourcemaps.properties`);
    copyFileSync(
      `${absoluteProjectPath}/../rn69.project.pbxproj`,
      `${absoluteProjectPath}/ios/MyApp.xcodeproj/project.pbxproj`
    );
    copyFileSync(
      `${absoluteProjectPath}/../build.gradle`,
      `${absoluteProjectPath}/android/app/build.gradle`
    );
  } catch (error) {
    console.log(error);
  }
});

describe("Setup command", () => {
  describe("execute", () => {
    it("returns a 0 code", async () => {
      const cli = makeCli();
      const code = await cli.run([absoluteProjectPath]);

      expect(code).toBe(0);
    });
  });
});

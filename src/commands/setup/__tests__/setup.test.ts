import { Cli } from "clipanion";
import { copyFileSync, unlinkSync } from "fs";
import { SetupCommand } from "../setup";
import { getAbsolutePath } from "../__test-utils__/get-absolute-path";

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
    copyFileSync(
      `${absoluteProjectPath}/../rn69.project.pbxproj`,
      `${absoluteProjectPath}/ios/MyApp.xcodeproj/project.pbxproj`
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

import { Cli } from "clipanion";
import { copyFileSync, unlinkSync } from "fs";
import { SetupCommand } from "../setup";
import { getAbsolutePath } from "../__test-utils__/get-absolute-path";

jest.mock("../../../utils/StepsCommand/Printer");

jest.mock("../create-configuration-files/get-configuration-data");
jest.mock("../apply-gradle-plugin/ask-is-obfuscation-enabled.ts");

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
    copyFileSync(
      `${absoluteProjectPath}/../build.gradle`,
      `${absoluteProjectPath}/android/app/build.gradle`
    );
  } catch (error) {
    console.log(error);
  }
});

describe("Setup command", () => {
  describe("execute with prompts", () => {
    it("returns a 0 code", async () => {
      const cli = makeCli();
      const code = await cli.run([absoluteProjectPath]);

      expect(code).toBe(0);
    });
  });

  describe("execute with CLI arguments", () => {
    it("returns a 0 code", async () => {
      const cli = makeCli();
      const code = await cli.run([
        "--bypass-prompts",
        "--android-minification",
        "--api-key",
        "FAKE_API_KEY",
        "--intake-url",
        "FAKE_INTAKE_URL",
        "--datadog-site",
        "GOV",
        absoluteProjectPath,
      ]);

      expect(code).toBe(0);
    });

    it("throws an error if the site is not a valid site", async () => {
      const cli = makeCli();
      const code = await cli.run([
        "--bypass-prompts",
        "--api-key",
        "FAKE_API_KEY",
        "--datadog-site",
        "FAKE_SITE",
        absoluteProjectPath,
      ]);

      expect(code).toBe(1);
    });

    it("throws an error if the apiKey was not specified", async () => {
      const cli = makeCli();
      const code = await cli.run(["--bypass-prompts", absoluteProjectPath]);
      expect(code).toBe(1);
    });
  });
});

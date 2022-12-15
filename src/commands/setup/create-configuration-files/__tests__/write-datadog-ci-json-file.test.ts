import { existsSync, unlinkSync } from "fs";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { writeDatadogCiJsonFile } from "../write-datadog-ci-json-file";

const testFilePath = getAbsolutePath(
  "src/commands/setup/create-configuration-files/__tests__/configuration.log"
);

afterEach(() => {
  try {
    unlinkSync(testFilePath);
  } catch (error) {
    console.log(error);
  }
});

describe("writeDatadogCiJsonFile", () => {
  it("writes the file with the apiKey, intakeURL and US site", async () => {
    await writeDatadogCiJsonFile(testFilePath, {
      apiKey: "my-api-key",
      site: "US1",
      intakeUrl: "custom-intake-url",
    });

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/create-configuration-files/__tests__/results/us.datadog-ci.json"
      )
    );
  });

  it("writes no file file when no parameter is given", async () => {
    await writeDatadogCiJsonFile(testFilePath, {});

    expect(existsSync(testFilePath)).toBeFalsy();
  });

  it("writes the file with the apiKey, intakeURL and EU site", async () => {
    await writeDatadogCiJsonFile(testFilePath, {
      apiKey: "my-api-key",
      site: "EU1",
      intakeUrl: "custom-intake-url",
    });

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/create-configuration-files/__tests__/results/eu.datadog-ci.json"
      )
    );
  });
});

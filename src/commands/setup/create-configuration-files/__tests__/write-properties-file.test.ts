import { existsSync, unlinkSync } from "fs";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { writePropertiesFile } from "../write-properties-file";

const testFilePath = getAbsolutePath(
  "src/commands/setup/create-configuration-files/__tests__/properties.log"
);

afterEach(() => {
  try {
    unlinkSync(testFilePath);
  } catch (error) {
    console.log(error);
  }
});

describe("writePropertiesFile", () => {
  it("writes the file with the apiKey, intakeURL and US site", async () => {
    await writePropertiesFile(testFilePath, {
      apiKey: "my-api-key",
      site: "US",
      intakeUrl: "custom-intake-url",
    });

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/create-configuration-files/__tests__/results/us.datadog-sourcemaps.properties"
      )
    );
  });

  it("writes no file file when no parameter is given", async () => {
    await writePropertiesFile(testFilePath, {});

    expect(existsSync(testFilePath)).toBeFalsy();
  });

  it("writes the file with the apiKey, intakeURL and EU site", async () => {
    await writePropertiesFile(testFilePath, {
      apiKey: "my-api-key",
      site: "EU",
      intakeUrl: "custom-intake-url",
    });

    // @ts-ignore
    expect(testFilePath).toMatchFile(
      getAbsolutePath(
        "src/commands/setup/create-configuration-files/__tests__/results/eu.datadog-sourcemaps.properties"
      )
    );
  });
});

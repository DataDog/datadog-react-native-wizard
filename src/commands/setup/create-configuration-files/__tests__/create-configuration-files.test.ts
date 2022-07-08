import { DatadogCiConfigFileAlreadyExists } from "../../errors";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { createConfigurationFiles } from "../create-configuration-files";

jest.mock("../get-configuration-data");

describe("createConfigurationFiles", () => {
  it("throws if file already exists", () => {
    expect(() =>
      createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/results"
        )
      )
    ).rejects.toThrowError(DatadogCiConfigFileAlreadyExists);
  });
});

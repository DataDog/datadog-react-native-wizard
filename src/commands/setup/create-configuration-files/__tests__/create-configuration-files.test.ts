import { unlinkSync } from "fs";
import { Store } from "../../../../utils/StepsCommand/Store";
import { DatadogCiConfigFileAlreadyExists } from "../../errors";
import { getAbsolutePath } from "../../__test-utils__/get-absolute-path";
import { createConfigurationFiles } from "../create-configuration-files";

jest.mock("../get-configuration-data");

describe("createConfigurationFiles", () => {
  describe("without existing config", () => {
    afterEach(() => {
      try {
        unlinkSync(
          getAbsolutePath(
            "src/commands/setup/create-configuration-files/__tests__/datadog-ci.json"
          )
        );
      } catch (error) {
        console.log(error);
      }
    });

    it("stores the datadog site into the store", async () => {
      const store = new Store({});
      await createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/"
        ),
        store
      );
      expect(store.get()).toEqual({
        datadogSite: "US",
      });
    });
  });

  it("throws if file already exists", () => {
    expect(() =>
      createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/results"
        ),
        new Store({})
      )
    ).rejects.toThrowError(DatadogCiConfigFileAlreadyExists);
  });
});

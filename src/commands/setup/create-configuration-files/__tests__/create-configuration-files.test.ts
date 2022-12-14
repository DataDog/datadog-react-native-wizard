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
      const store = new Store({ bypassPrompts: false });
      await createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/"
        ),
        store
      );
      expect(store.get()).toEqual({
        bypassPrompts: false,
        datadogSite: "US",
      });
    });

    it("uses the value from the store if", async () => {
      const store = new Store({ bypassPrompts: true });
      await createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/"
        ),
        store
      );
      expect(store.get()).toEqual({
        bypassPrompts: true,
        datadogSite: "US",
      });
    });
  });

  it("throws if file already exists", () => {
    const store = new Store({ bypassPrompts: false });
    expect(() =>
      createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/results"
        ),
        store
      )
    ).rejects.toThrowError(DatadogCiConfigFileAlreadyExists);
  });
});

import { unlinkSync } from "fs";
import { Store } from "../../../../utils/StepsCommand/Store";
import { DatadogCiConfigFileAlreadyExists } from "../../errors";
import { DatadogSite } from "../../interface";
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

    it("stores the datadog site into the store when prompting", async () => {
      const store = new Store({ bypassPrompts: false });
      await createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/"
        ),
        store
      );
      expect(store.get()).toEqual({
        bypassPrompts: false,
        datadogSite: "US1",
      });
    });

    it("stores the datadog site into the store when bypassing prompts (default value)", async () => {
      const store = new Store({ bypassPrompts: true });
      await createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/"
        ),
        store
      );
      expect(store.get()).toEqual({
        bypassPrompts: true,
        datadogSite: "US1",
      });
    });

    it("stores the datadog site into the store when bypassing prompts", async () => {
      const store = new Store({
        bypassPrompts: true,
        datadogSite: "EU1" as DatadogSite,
      });
      await createConfigurationFiles(
        getAbsolutePath(
          "src/commands/setup/create-configuration-files/__tests__/"
        ),
        store
      );
      expect(store.get()).toEqual({
        bypassPrompts: true,
        datadogSite: "EU1",
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

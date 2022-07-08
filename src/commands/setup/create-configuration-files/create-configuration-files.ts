import { existsSync } from "fs";
import { Store } from "../../../utils/StepsCommand/Store";
import { DatadogCiConfigFileAlreadyExists } from "../errors";
import { getConfigurationData } from "./get-configuration-data";
import { writeDatadogCiJsonFile } from "./write-datadog-ci-json-file";

export const createConfigurationFiles = async (
  absoluteProjectPath: string,
  store: Store<{ datadogSite?: string }>
) => {
  const configuration = await getConfigurationData();
  store.set((state) => {
    return {
      ...state,
      datadogSite: configuration.site,
    };
  });

  const configurationFilePath = `${absoluteProjectPath}/datadog-ci.json`;
  if (existsSync(configurationFilePath)) {
    throw new DatadogCiConfigFileAlreadyExists();
  }
  await writeDatadogCiJsonFile(configurationFilePath, configuration);
};

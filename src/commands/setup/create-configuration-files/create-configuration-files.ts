import { existsSync } from "fs";
import { Store } from "../../../utils/StepsCommand/Store";
import { DatadogCiConfigFileAlreadyExists } from "../errors";
import { DatadogSite, DEFAULT_DATADOG_SITE } from "../interface";
import { getConfigurationData } from "./get-configuration-data";
import { ConfigurationData } from "./interface";
import { writeDatadogCiJsonFile } from "./write-datadog-ci-json-file";

export const createConfigurationFiles = async (
  absoluteProjectPath: string,
  store: Store<{
    apiKey?: string;
    bypassPrompts: boolean;
    datadogSite?: DatadogSite;
    intakeUrl?: string;
  }>
) => {
  const configuration = await getConfiguration(store);

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

const getConfiguration = async (
  store: Store<{
    apiKey?: string;
    bypassPrompts: boolean;
    datadogSite?: DatadogSite;
    intakeUrl?: string;
  }>
): Promise<ConfigurationData> => {
  const storeState = store.get();

  if (storeState.bypassPrompts) {
    return new Promise((resolve) =>
      resolve({
        apiKey: storeState.apiKey,
        site: storeState.datadogSite || DEFAULT_DATADOG_SITE,
        intakeUrl: storeState.intakeUrl,
      })
    );
  }

  const configuration = await getConfigurationData();
  return configuration;
};

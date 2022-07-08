import { existsSync } from "fs";
import { DatadogCiConfigFileAlreadyExists } from "../errors";
import { getConfigurationData } from "./get-configuration-data";
import { writeDatadogCiJsonFile } from "./write-datadog-ci-json-file";

export const createConfigurationFiles = async (absoluteProjectPath: string) => {
  const configuration = await getConfigurationData();
  const configurationFilePath = `${absoluteProjectPath}/datadog-ci.json`;
  if (existsSync(configurationFilePath)) {
    throw new DatadogCiConfigFileAlreadyExists();
  }
  await writeDatadogCiJsonFile(configurationFilePath, configuration);
};

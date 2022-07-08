import { getConfigurationData } from "./get-configuration-data";
import { writePropertiesFile } from "./write-properties-file";

export const createConfigurationFiles = async (absoluteProjectPath: string) => {
  const properties = await getConfigurationData();
  await writePropertiesFile(
    `${absoluteProjectPath}/datadog-sourcemaps.properties`,
    properties
  );
};

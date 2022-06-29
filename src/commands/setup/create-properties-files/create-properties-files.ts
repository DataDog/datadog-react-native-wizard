import { getPropertiesData } from "./get-properties-data";
import { writePropertiesFile } from "./write-properties-file";

export const createPropertiesFiles = async (absoluteProjectPath: string) => {
  const properties = await getPropertiesData();
  await writePropertiesFile(
    `${absoluteProjectPath}/datadog-sourcemaps.properties`,
    properties
  );
};

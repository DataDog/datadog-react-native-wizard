import { createWriteStream } from "fs";
import { EOL } from "os";
import { asyncCloseWriteStream } from "../utils/edit-file";

export const writePropertiesFile = async (
  absoluteFilePath: string,
  params: { apiKey?: string; site?: string; intakeUrl?: string }
) => {
  const propertiesFileLines = generatePropertiesFileLines(params);
  if (propertiesFileLines.length === 0) {
    return;
  }

  const writer = createWriteStream(absoluteFilePath, { flags: "a" });

  propertiesFileLines.forEach((line) => {
    writer.write(`${line}${EOL}`);
  });

  await asyncCloseWriteStream(writer);
};

const generatePropertiesFileLines = (params: {
  apiKey?: string;
  site?: string;
  intakeUrl?: string;
}): string[] => {
  const lines: string[] = [];

  if (params.apiKey) {
    lines.push(`DATADOG_API_KEY=${params.apiKey}`);
  }

  const siteURL = getSiteURLFromSite(params.site);
  if (siteURL) {
    lines.push(`DATADOG_SITE=${siteURL}`);
  }

  if (params.intakeUrl) {
    lines.push(`DATADOG_SOURCEMAP_INTAKE_URL=${params.intakeUrl}`);
  }

  return lines;
};

const getSiteURLFromSite = (site?: string): string | null => {
  if (!site) {
    return null;
  }
  if (site === "EU") {
    return "datadoghq.eu";
  }

  return null;
};

import { createWriteStream } from "fs";
import { EOL } from "os";
import { asyncCloseWriteStream } from "../utils/edit-file";
import { ConfigurationData } from "./interface";

export const writeDatadogCiJsonFile = async (
  absoluteFilePath: string,
  params: ConfigurationData
) => {
  const JSONFileLines = generateConfigurationFileLines(params);
  if (JSONFileLines.length === 0) {
    return;
  }

  const writer = createWriteStream(absoluteFilePath, { flags: "a" });

  writer.write(`{${EOL}`);
  JSONFileLines.forEach((line) => {
    writer.write(`${line}${EOL}`);
  });
  writer.write(`}${EOL}`);

  await asyncCloseWriteStream(writer);
};

const generateConfigurationFileLines = (
  params: ConfigurationData
): string[] => {
  const lines: string[] = [];
  const siteURL = getSiteURLFromSite(params.site);

  if (params.apiKey) {
    const isLastLine = !siteURL;
    lines.push(generateJSONLine("apiKey", params.apiKey, { isLastLine }));
  }

  if (siteURL) {
    lines.push(generateJSONLine("datadogSite", siteURL, { isLastLine: true }));
  }

  return lines;
};

const generateJSONLine = (
  key: string,
  value: string,
  options: { isLastLine: boolean }
) => {
  return `  "${key}": "${value}"${options.isLastLine ? "" : ","}`;
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

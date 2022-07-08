import chalk from "chalk";
import { DatadogCiConfigFileAlreadyExists } from "../errors";

const errorDetails = [
  `There was an error creating your ${chalk.bold(
    "datadog-ci.json"
  )} configuration file.`,
  `Create one with your Datadog API key under ${chalk.bold("apiKey")}.`,
  `Your can also pass the API key as a ${chalk.bold(
    "DATADOG_API_KEY"
  )} environment variable in your builds.`,
];

const datadogCiConfigFileAlreadyExistsDetails = [
  `There already is a ${chalk.bold("datadog-ci.json")} configuration file`,
  `Make sure it contains your Datadog API key under ${chalk.bold("apiKey")}.`,
  `Your can also pass the API key as a ${chalk.bold(
    "DATADOG_API_KEY"
  )} environment variable in your builds.`,
];

export const createConfigurationFilesErrorHandler = async (error: unknown) => {
  return {
    error,
    terminating: false,
    details:
      error instanceof DatadogCiConfigFileAlreadyExists
        ? datadogCiConfigFileAlreadyExistsDetails
        : errorDetails,
  };
};

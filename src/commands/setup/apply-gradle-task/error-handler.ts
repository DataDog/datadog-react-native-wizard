import chalk from "chalk";
import { DatadogCoreTooOldError } from "../errors";

const errorDetails = [
  `There was an error applying the gradle task to your ${chalk.bold(
    "android/app/build.gradle"
  )} file.`,
  `Add the following line right after ${chalk.bold(
    'apply from: "../../node_modules/react-native/react.gradle"'
  )}:`,
  `\n${chalk.bold(
    `apply from: "../../node_modules/@datadog/mobile-react-native/datadog-sourcemaps.gradle"`
  )}.\n`,
];

const datadogCoreTooOldErrorDetails = [
  "Your version of @datadog/mobile-react-native is too old.",
  `You can update to the latest version by running:`,
  `\n${chalk.bold("yarn upgrade @datadog/mobile-react-native --latest")}.\n`,
];

export const applyGradleTaskErrorHandler = async (error: unknown) => {
  return {
    error,
    terminating: false,
    details:
      error instanceof DatadogCoreTooOldError
        ? datadogCoreTooOldErrorDetails
        : errorDetails,
  };
};

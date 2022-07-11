import chalk from "chalk";
import { GradlePluginNotAutomated } from "../errors";

const applicationVariantsLoopCode = [
  chalk.bold(
    `        if (project.tasks.findByName("minify\${variant.name.capitalize()}WithR8")) {`
  ),
  chalk.bold(
    `            tasks["minify\${variant.name.capitalize()}WithR8"].finalizedBy { tasks["uploadMapping\${variant.name.capitalize()}"] }`
  ),
  chalk.bold(`        }`),
];

const errorDetails = [
  `There was an error applying the gradle plugin for proguard mapping files to your ${chalk.bold(
    "android/app/build.gradle"
  )} file.`,
  `Add the following lines right at the top of your ${chalk.bold(
    "android/app/build.gradle"
  )} file:`,
  `\n${chalk.bold(`plugins {`)}`,
  chalk.bold(
    `    id("com.datadoghq.dd-sdk-android-gradle-plugin") version "1.4.0"`
  ),
  chalk.bold(`}`),
  `\n${chalk.bold(`datadog {`)}`,
  chalk.bold(`    checkProjectDependencies = "none"`),
  chalk.bold(`}`),
  `\nThen at the start of the ${chalk.bold("applicationVariants.all")} loop:\n`,
  ...applicationVariantsLoopCode,
];

const gradlePluginNotAutomated = [
  `The gradle plugin for proguard mapping files could not be automated to run on each build.`,
  `To do so, find or create a loop in your ${chalk.bold(
    "android/app/build.gradle"
  )} file containing ${chalk.bold(
    "applicationVariants.all { variant ->"
  )}, then add at its start:\n`,
  ...applicationVariantsLoopCode,
];

export const applyGradlePluginErrorHandler = async (error: unknown) => {
  return {
    error,
    terminating: false,
    details:
      error instanceof GradlePluginNotAutomated
        ? gradlePluginNotAutomated
        : errorDetails,
  };
};

import chalk from "chalk";

export const changeXCodeBuildPhaseErrorDetails = [
  `In order to run the sourcemaps upload on every XCode build, you need to edit the ${chalk.bold(
    "Bundle React Native code and images"
  )} build phase in XCode.`,
  `Please refer to https://github.com/DataDog/datadog-ci/tree/master/src/commands/react-native for instructions`,
];

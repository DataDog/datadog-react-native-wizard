import chalk from "chalk";

export const addXCodeDsymsBuildPhaseErrorDetails = [
  `We could not setup a new build phase in XCode to automatically upload dSYMs files after each iOS build.`,
  `If you want to symbolicate native crashes, add a ${chalk.bold(
    "New Run Script Phase"
  )} inside your project build phases and add the following script to it:\n`,
  chalk.bold(
    `/opt/homebrew/bin/node /opt/homebrew/bin/yarn datadog-ci dsyms upload $DWARF_DSYM_FOLDER_PATH`
  ),
];

import chalk from "chalk";
import inquirer from "inquirer";

export const askIsObfuscationEnabled = async (): Promise<boolean> => {
  const prompt = await inquirer.prompt([
    {
      type: "confirm",
      name: "isObfuscationEnabled",
      default: false,
      message: `Have you enabled Android minification and obfuscation (see https://reactnative.dev/docs/signed-apk-android#enabling-proguard-to-reduce-the-size-of-the-apk-optional)?\nIf you have it enabled, ${chalk.bold(
        "(cd android && ./gradlew tasks --all) | grep minifyReleaseWithR8"
      )} should return ${chalk.bold("app:minifyReleaseWithR8")}`,
    },
  ]);

  return prompt.isObfuscationEnabled;
};

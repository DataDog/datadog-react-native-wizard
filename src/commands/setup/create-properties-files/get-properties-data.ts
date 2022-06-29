import inquirer from "inquirer";

export const getPropertiesData = async (): Promise<{
  apiKey?: string;
  site?: string;
  intakeURL?: string;
}> => {
  return inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message:
        "Enter your apiKey.\nYou can find one in your organization settings.",
    },
    {
      type: "choice",
      name: "site",
      message: "Select the site of your organization.",
      default: "US",
      choices: [
        { name: "US", value: "US" },
        { name: "EU", value: "EU" },
        { name: "US3", value: "US3" },
        { name: "US5", value: "US5" },
        { name: "GOV", value: "GOV" },
      ],
    },
    {
      type: "input",
      name: "intakeURL",
      message:
        "Enter a custom intake URL if you use one. If you don't use one, just press enter.",
    },
  ]);
};

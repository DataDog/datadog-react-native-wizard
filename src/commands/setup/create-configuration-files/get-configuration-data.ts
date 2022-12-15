import inquirer from "inquirer";
import { DatadogSite } from "../interface";
import { ConfigurationData } from "./interface";

// Keeping this variable apart to ensure typing on DatdogSite as
// Inquirer does not progate typing
const siteChoices: { name: string; value: DatadogSite }[] = [
  { name: "US1", value: "US1" },
  { name: "EU1", value: "EU1" },
  { name: "US3", value: "US3" },
  { name: "US5", value: "US5" },
  { name: "GOV", value: "GOV" },
];

export const getConfigurationData = async (): Promise<ConfigurationData> => {
  return inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message:
        "Enter your apiKey. You can find one in your organization settings.",
    },
    {
      type: "list",
      name: "site",
      message: "Select the site of your organization.",
      default: "US1",
      choices: siteChoices,
    },
    {
      type: "input",
      name: "intakeUrl",
      message:
        "Enter a custom intake URL if you use one. If you don't use one, just press enter.",
    },
  ]);
};

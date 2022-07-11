import { DatadogSite } from "../interface";

export type ConfigurationData = {
  apiKey?: string;
  site?: DatadogSite;
  intakeUrl?: string;
};

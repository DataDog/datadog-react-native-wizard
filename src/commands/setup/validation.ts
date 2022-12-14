import { ApiKeyNotProvided, DatadogSiteValueError } from "./errors";
import { DatadogSite, datadogSites } from "./interface";
import { SetupCommandStateType } from "./setup";

const isDatadogSite = (value: unknown): value is DatadogSite => {
  return datadogSites.includes(value as DatadogSite);
};

export const validateInitialState = (initialState: {
  androidMinificationEnabled?: boolean;
  apiKey?: string;
  bypassPrompts: boolean;
  datadogSite?: string;
  intakeUrl?: string;
}): SetupCommandStateType => {
  if (initialState.bypassPrompts && !initialState.apiKey) {
    throw new ApiKeyNotProvided();
  }
  const datadogSite = initialState.datadogSite;
  if (datadogSite === undefined) {
    return { ...initialState, datadogSite };
  }
  if (!isDatadogSite(datadogSite)) {
    throw new DatadogSiteValueError();
  }

  return { ...initialState, datadogSite };
};

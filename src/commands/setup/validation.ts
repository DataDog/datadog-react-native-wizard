import { ApiKeyNotProvided, DatadogSiteValueNotValid } from "./errors";
import { DatadogSite, datadogSites } from "./interface";
import { SetupCommandInitialStateType, SetupCommandStateType } from "./setup";

const isDatadogSite = (value: unknown): value is DatadogSite => {
  return datadogSites.includes(value as DatadogSite);
};

export const validateInitialState = (
  initialState: SetupCommandInitialStateType
): SetupCommandStateType => {
  if (initialState.bypassPrompts && !initialState.apiKey) {
    throw new ApiKeyNotProvided(JSON.stringify(initialState.apiKey));
  }
  const datadogSite = initialState.datadogSite;
  if (!isDatadogSite(datadogSite) && datadogSite !== undefined) {
    throw new DatadogSiteValueNotValid(datadogSite);
  }

  return {
    ...initialState,
    bypassPrompts: !!initialState.bypassPrompts,
    datadogSite,
  };
};

export const handleValidationError = (error: unknown): string => {
  if (error instanceof DatadogSiteValueNotValid) {
    return `The datadog site provided ${error.site} is not valid.`;
  }
  if (error instanceof ApiKeyNotProvided) {
    return `The API key provided "${error.apiKey}" is not valid.`;
  }
  return "An unknown error happened while validating the arguments passed to the command.";
};

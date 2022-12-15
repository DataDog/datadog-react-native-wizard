export class ReactNativeProjectError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ReactNativeProjectError";
  }
}

export class DatadogCoreTooOldError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DatadogCoreTooOldError";
  }
}

export class DatadogCiConfigFileAlreadyExists extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DatadogCiConfigFileAlreadyExists";
  }
}

export class GradlePluginNotInstalled extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "GradlePluginNotInstalled";
  }
}
export class GradlePluginNotAutomated extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "GradlePluginNotAutomated";
  }
}

export class DatadogSiteValueNotValid extends Error {
  site: string;

  constructor(site: string, message?: string) {
    super(message);
    this.site = site;
    this.name = "DatadogSiteValueNotValid";
  }
}

export class ApiKeyNotProvided extends Error {
  apiKey: string;

  constructor(apiKey: string, message?: string) {
    super(message);
    this.apiKey = apiKey;
    this.name = "ApiKeyNotProvided";
  }
}

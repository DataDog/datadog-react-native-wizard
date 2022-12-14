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

export class DatadogSiteValueError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DatadogSiteValueError";
  }
}

export class ApiKeyNotProvided extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ApiKeyNotProvided";
  }
}

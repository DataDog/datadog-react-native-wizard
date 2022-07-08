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

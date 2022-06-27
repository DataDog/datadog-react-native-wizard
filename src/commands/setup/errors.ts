export class ReactNativeProjectError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ReactNativeProjectError";
  }
}

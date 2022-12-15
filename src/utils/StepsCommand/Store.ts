function isArgumentCallback<T>(
  argument: T | ((state: T) => T)
): argument is (state: T) => T {
  return typeof argument === "function";
}

export class Store<StateType extends object | void> {
  private state: StateType;

  constructor(initialState: StateType) {
    this.state = initialState;
  }

  public get = (): StateType => {
    return this.state;
  };

  public set(argument: StateType): StateType;
  public set(argument: (state: StateType) => StateType): StateType;
  public set(
    argument: StateType | ((state: StateType) => StateType)
  ): StateType {
    if (isArgumentCallback(argument)) {
      this.state = argument(this.state);
      return this.state;
    }

    this.state = argument;
    return this.state;
  }
}

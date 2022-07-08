export class Store<StateType extends object | void> {
  private state: StateType;

  constructor(initialState: StateType) {
    this.state = initialState;
  }

  public get = (): StateType => {
    return this.state;
  };

  private isArgumentCallback = (
    argument: StateType | ((state: StateType) => StateType)
  ): argument is (state: StateType) => StateType => {
    return typeof argument === "function";
  };

  public set = (argument: StateType | ((state: StateType) => StateType)) => {
    if (this.isArgumentCallback(argument)) {
      this.state = argument(this.state);
      return this.state;
    }

    this.state = argument;
    return this.state;
  };
}

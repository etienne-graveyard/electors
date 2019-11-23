export type DependencyList = ReadonlyArray<any>;

export type Selector<Inputs extends Array<any>, Output> = (...inputs: Inputs) => Output;

export interface ElectorsContext {
  execute<Inputs extends Array<any>, Output>(
    selector: Selector<Inputs, Output>,
    ...inputs: Inputs
  ): Output;
  destroy(): void;
}

export type MemoHookData = {
  deps: ReadonlyArray<any>;
  result: any;
};

export type Executor = <Inputs extends Array<any>, Output>(
  selector: Selector<Inputs, Output>,
  ...inputs: Inputs
) => Output;

export interface InternalContext {
  executor: Executor;
  context: ElectorsContext;
  hooks: Array<MemoHookData> | null;
  nextHooks: Array<MemoHookData>;
}

export interface InternalState {
  current: InternalContext | null;
}

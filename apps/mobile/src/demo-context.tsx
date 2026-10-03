import { createContext, type Dispatch, type PropsWithChildren, useContext, useReducer } from 'react';
import { demoReducer, initialDemoState } from './demo-state';

type DemoContextValue = {
  state: typeof initialDemoState;
  dispatch: Dispatch<Parameters<typeof demoReducer>[1]>;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}

export function useDemoState() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemoState must be used inside DemoProvider');
  return value;
}

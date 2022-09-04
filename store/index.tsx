import React, { createContext, ReactElement, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createStore, { IStore } from './rootStore';

interface IProps {
  initialValue: Record<any, any>;
  children: ReactElement;
}

//如果enableStaticRendering设为true就不会响应了，如果是浏览器环境就是设为false
//如果是ssr环境的话就置为false
enableStaticRendering(!process.browser);

const StoreContext = createContext({});

export const StoreProvider = ({ initialValue, children }: IProps) => {
  const store: IStore = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore;
  if (!store) {
    throw new Error('数据不存在');
  }
  return store;
}

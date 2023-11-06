import { createContext } from 'react';

export const ScrollContext = createContext({ current: null });

export const ScrollProvider = ScrollContext.Provider;

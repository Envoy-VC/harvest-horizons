import type { PropsWithChildren } from 'react';

import { QueryProvider } from './query-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>;
};

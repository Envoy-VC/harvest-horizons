import type { PropsWithChildren } from 'react';

import { Toaster } from '~/components/ui/sonner';
import { QueryProvider } from './query-provider';
import { Web3Provider } from './web3-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <Web3Provider>
        <Toaster />
        {children}
      </Web3Provider>
    </QueryProvider>
  );
};

import type { PropsWithChildren } from 'react';

import { Toaster } from '~/components/ui/sonner';
import { QueryProvider } from './query-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <Toaster />
      {children}
    </QueryProvider>
  );
};

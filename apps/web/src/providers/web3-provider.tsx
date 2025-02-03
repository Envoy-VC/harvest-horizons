import { createAppKit } from '@reown/appkit/react';

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { avalancheFuji } from '@reown/appkit/networks';

import type { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: 'Harvest Horizons',
  description: 'AppKit Example',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

const networks = [avalancheFuji];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  // @ts-expect-error it is safe
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
  );
};

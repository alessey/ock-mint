'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
  
const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      preference: process.env.NEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG as
        | 'smartWalletOnly'
        | 'all',
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

// Create a wrapper component for OnchainKitProvider
function OnchainKitWrapper({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      schemaId="0xB4E741B761D8B69103cc986F1B7Cd71Ed627f8CC000000000000000000000000"
      config={{ appearance: { mode: 'auto', theme: 'base' } }}
    >
      {children}
    </OnchainKitProvider>
  );
}

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitWrapper>
          {props.children}
        </OnchainKitWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    LedgerWalletAdapter,
    TorusWalletAdapter,
    Coin98WalletAdapter,
    MathWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import './styles/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const Root = () => {
    // Solana mainnet-beta endpoint for production
    const endpoint = useMemo(() => {
        // Fallback 1: PublicNode (High reliability free tier)
        const publicNodeRpc = 'https://solana-rpc.publicnode.com';
        // Fallback 2: Ankr
        const ankrRpc = 'https://rpc.ankr.com/solana';

        return import.meta.env.VITE_RPC_ENDPOINT || publicNodeRpc || ankrRpc;
    }, []);

    // Comprehensive wallet adapter support
    // Major Solana wallets with mobile deep linking support
    const wallets = useMemo(
        () => [
            // new PhantomWalletAdapter(), // Removed: Detected automatically by Standard Wallet
            new SolflareWalletAdapter(),     // Popular, good mobile app
            new TorusWalletAdapter(),        // Social login wallet
            new LedgerWalletAdapter(),       // Hardware wallet support
            new Coin98WalletAdapter(),       // Multi-chain wallet
            new MathWalletAdapter(),         // Multi-chain support
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <LanguageProvider>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <App />
                    </WalletModalProvider>
                </WalletProvider>
            </LanguageProvider>
        </ConnectionProvider>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <Root />
        </React.StrictMode>
    );
}

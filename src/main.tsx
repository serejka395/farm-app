
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    BackpackWalletAdapter,
    TrustWalletAdapter,
    CoinbaseWalletAdapter,
    LedgerWalletAdapter,
    TorusWalletAdapter,
    SlopeWalletAdapter,
    GlowWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import './styles/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const Root = () => {
    // Solana mainnet-beta endpoint for production
    // Use Helius RPC for better performance and reliability
    const endpoint = useMemo(() => {
        // Primary: Helius free tier (rate limited but fast)
        const heliusRpc = 'https://rpc.helius.xyz/?api-key=public';
        // Fallback: Official mainnet
        const mainnetRpc = clusterApiUrl('mainnet-beta');

        // In production, use Helius; for development, can switch
        return process.env.VITE_RPC_ENDPOINT || heliusRpc;
    }, []);

    // Comprehensive wallet adapter support
    // All major Solana wallets with mobile deep linking
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),      // Most popular, excellent mobile support
            new SolflareWalletAdapter(),     // Popular, good mobile app
            new BackpackWalletAdapter(),     // New but popular, xNFT support
            new TrustWalletAdapter(),        // Mobile-first, widely used
            new CoinbaseWalletAdapter(),     // Major exchange wallet
            new GlowWalletAdapter(),         // Solana native, good UX
            new SlopeWalletAdapter(),        // Mobile-focused
            new TorusWalletAdapter(),        // Social login wallet
            new LedgerWalletAdapter(),       // Hardware wallet support
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


import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import './styles/index.css';
import '@solana/wallet-adapter-react-ui/styles.css'; // Also ensure wallet styles are imported if not elsewhere

const Root = () => {
    // Solana network endpoint
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

    // Supported wallet adapters
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
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

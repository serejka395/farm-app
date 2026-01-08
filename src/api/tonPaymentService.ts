
import { TonConnectUI } from '@tonconnect/ui-react';

export const ADMIN_TON_WALLET = 'UQA2HIP7gDbN-84NqV5tFx_v6hsjKeGx_3ZnQRUBs9em3Lm8';

export const tonPaymentService = {
    createPaymentTransaction: (amountInTon: number) => {
        // Convert TON to NanoTON (1 TON = 1,000,000,000 NanoTON)
        const amountNano = Math.floor(amountInTon * 1000000000).toString();

        // Create standard TON transaction payload
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
            messages: [
                {
                    address: ADMIN_TON_WALLET,
                    amount: amountNano,
                    // Optional: You can explicitly specify payload (comment/memo) if needed for tracking
                    // For MVP, simple transfer
                },
            ],
        };

        return transaction;
    },

    // In a real app, verify via TON API (toncenter / tonapi.io)
    // For MVP Client-Side, we rely on the wallet's success response, or basic hash check if available.
    // The SDK sendTransaction returns a promise that resolves on success.
    verifyTransaction: async (txResult: any): Promise<boolean> => {
        // If the SDK resolved successfully, basic client-side verification is passed.
        // In production, send txResult.boc to backend to verify inclusion and destination.
        console.log('TON Transaction Result:', txResult);
        if (txResult && txResult.boc) {
            return true;
        }
        return false;
    }
};

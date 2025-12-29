import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { ADMIN_WALLET, PLATFORM_FEE_PERCENT } from '../utils/constants';

export const paymentService = {
    createPaymentTransaction: async (
        buyerPublicKey: PublicKey,
        amountInSol: number
    ): Promise<Transaction> => {
        // Calculate precise amounts in Lamports
        const baseLamports = Math.floor(amountInSol * LAMPORTS_PER_SOL);
        const feeLamports = Math.floor(baseLamports * PLATFORM_FEE_PERCENT);
        const totalLamports = baseLamports + feeLamports;

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: buyerPublicKey,
                toPubkey: new PublicKey(ADMIN_WALLET),
                lamports: totalLamports,
            })
        );
        return transaction;
    },

    verifyTransaction: async (
        connection: Connection,
        signature: string
    ): Promise<boolean> => {
        try {
            const status = await connection.getSignatureStatus(signature, {
                searchTransactionHistory: true,
            });

            if (status?.value?.confirmationStatus === 'confirmed' || status?.value?.confirmationStatus === 'finalized') {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Transaction verification failed:', error);
            return false;
        }
    }
};

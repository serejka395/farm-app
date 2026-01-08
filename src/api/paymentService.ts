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

    validateTransaction: async (
        connection: Connection,
        signature: string,
        expectedAmountSol: number
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            // 1. Poll for Status (Wait for Confirmation)
            const status = await connection.getSignatureStatus(signature, {
                searchTransactionHistory: true,
            });

            if (status?.value?.err) {
                return { success: false, error: `Transaction Verified as FAILED: ${JSON.stringify(status.value.err)}` };
            }

            const confirmation = status?.value?.confirmationStatus;
            if (confirmation !== 'confirmed' && confirmation !== 'finalized') {
                // Caller should retry or handle this "pending" state
                return { success: false, error: 'Transaction pending confirmation...' };
            }

            // 2. Fetch Full Transaction Data (Deep Inspection)
            const tx = await connection.getParsedTransaction(signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0
            });

            if (!tx) {
                return { success: false, error: 'Transaction not found on chain (yet).' };
            }

            // 3. Verify Payment Logic
            // We need to find the transfer instruction to ADMIN_WALLET
            const expectedLamports = Math.floor(expectedAmountSol * LAMPORTS_PER_SOL);
            const feeLamports = Math.floor(expectedLamports * PLATFORM_FEE_PERCENT);
            // Note: In createPayment, we add fee to base. So expectedAmountSol input should be the BASE amount? 
            // No, strictly speaking createPayment takes "amountInSol" and ADDS fee.
            // So total transferred = amountInSol * (1 + fee).
            const totalExpected = expectedLamports + feeLamports;
            // Allow small delta for float math (100 lamports)
            const tolerance = 100;

            // Scan instructions for SystemProgram.transfer
            const instructions = tx.transaction.message.instructions;
            let validTransferFound = false;

            for (const ix of instructions) {
                // Check for "parsed" instruction (System Program)
                if ('parsed' in ix && ix.program === 'system' && ix.parsed.type === 'transfer') {
                    const info = ix.parsed.info;
                    if (info.destination === ADMIN_WALLET) {
                        const amountStart = BigInt(info.lamports);
                        const expectedBig = BigInt(totalExpected);

                        // Check if amount is roughly correct
                        const diff = amountStart > expectedBig ? amountStart - expectedBig : expectedBig - amountStart;
                        if (diff <= BigInt(tolerance)) {
                            validTransferFound = true;
                            break;
                        }
                    }
                }
            }

            if (!validTransferFound) {
                return { success: false, error: 'Invalid Transfer: Destination or Amount mismatch.' };
            }

            return { success: true };

        } catch (error) {
            console.error('Deep validation failed:', error);
            return { success: false, error: 'Validator Error' };
        }
    }
};

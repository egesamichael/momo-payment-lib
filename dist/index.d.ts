interface PaymentRequest {
    amount: number;
    phoneNumber: string;
    currency: string;
    refrence: string;
}
interface TransferRequest {
    amount: number;
    currency: string;
    externalId: string;
    partyId: string;
    payerMessage: string;
    payeeNote: string;
}
interface MoMoClientConfig {
    apiUserId: string;
    apiKey: string;
    collectionKey?: string;
    remittanceKey?: string;
    environment?: 'sandbox' | 'production';
}
declare class MoMoClient {
    private apiUserId;
    private apiKey;
    private collectionKey?;
    private remittanceKey?;
    private environment;
    private baseUrl;
    constructor(config: MoMoClientConfig);
    private getAuthToken;
    requestPayment(payment: PaymentRequest): Promise<{
        referenceId: string;
    }>;
    initiateTransfer(transfer: TransferRequest): Promise<{
        referenceId: string;
    }>;
    getPaymentStatus(referenceId: string): Promise<any>;
}

export { MoMoClient };

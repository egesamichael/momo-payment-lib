interface MoMoKeyConfig {
    apiUserId: string;
    apiKey: string;
    primaryKey: string;
}
interface MoMoClientConfig {
    collectionKey: MoMoKeyConfig;
    remittance: MoMoKeyConfig;
    environment?: 'sandbox' | 'production';
}
interface PaymentRequest {
    amount: number;
    currency: string;
    phoneNumber: string;
    reference: string;
}
interface RemittanceRequest {
    amount: number;
    currency: string;
    receiverNumber: string;
    reason: string;
    reference: string;
}
declare class MoMoClient {
    private collectionKey;
    private remittance;
    private environment;
    constructor(config: MoMoClientConfig);
    private getBaseUrl;
    private getAuthToken;
    requestPayment(payment: PaymentRequest): Promise<{
        referenceId: string;
    }>;
    getPaymentStatus(referenceId: string): Promise<any>;
    sendRemittance(remittance: RemittanceRequest): Promise<{
        referenceId: string;
    }>;
    getRemittanceStatus(referenceId: string): Promise<any>;
}

export { MoMoClient };

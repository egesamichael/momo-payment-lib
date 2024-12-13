interface PaymentRequest {
    amount: number;
    phoneNumber: string;
    currency: string;
    refrence: string;
}
interface MoMoClientConfig {
    apiUserId: string;
    apiKey: string;
    primaryKey: string;
    environment?: 'sandbox' | 'production';
}
declare class MoMoClient {
    private apiUserId;
    private apiKey;
    private primaryKey;
    private environment;
    private baseUrl;
    constructor(config: MoMoClientConfig);
    private getAuthToken;
    requestPayment(payment: PaymentRequest): Promise<{
        referenceId: string;
    }>;
    getPaymentStatus(referenceId: string): Promise<any>;
}

export { MoMoClient };

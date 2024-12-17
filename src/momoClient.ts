import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

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

export class MoMoClient {
  private collectionKey: MoMoKeyConfig;
  private remittance: MoMoKeyConfig;
  private environment: 'sandbox' | 'production';

  constructor(config: MoMoClientConfig) {
    this.collectionKey = config.collectionKey;
    this.remittance = config.remittance;
    this.environment = config.environment || 'sandbox';
  }

  private getBaseUrl(): string {
    return `https://${this.environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com`;
  }

  private async getAuthToken(keyConfig: MoMoKeyConfig): Promise<string> {
    try {
      const response = await axios.post(`${this.getBaseUrl()}/token/`, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${keyConfig.apiUserId}:${keyConfig.apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': keyConfig.primaryKey,
        },
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error getting auth token:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Request Payment (Collection Service)
  public async requestPayment(payment: PaymentRequest): Promise<{ referenceId: string }> {
    const referenceId = uuidv4();
    try {
      const authToken = await this.getAuthToken(this.collectionKey);
      await axios.post(
        `${this.getBaseUrl()}/collection/v1_0/requesttopay`,
        {
          amount: payment.amount,
          currency: payment.currency,
          externalId: payment.reference,
          payer: {
            partyIdType: 'MSISDN',
            partyId: payment.phoneNumber,
          },
          payerMessage: 'Payment Request',
          payeeNote: 'Please complete payment',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.collectionKey.primaryKey,
          },
        }
      );
      return { referenceId };
    } catch (error: any) {
      console.error('Error requesting payment:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Check Payment Status (Collection Service)
  public async getPaymentStatus(referenceId: string): Promise<any> {
    try {
      const authToken = await this.getAuthToken(this.collectionKey);
      const response = await axios.get(`${this.getBaseUrl()}/collection/v1_0/requesttopay/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.collectionKey.primaryKey,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error getting payment status:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Send Remittance (Remittance Service)
  public async sendRemittance(remittance: RemittanceRequest): Promise<{ referenceId: string }> {
    const referenceId = uuidv4();
    try {
      const authToken = await this.getAuthToken(this.remittance);
      await axios.post(
        `${this.getBaseUrl()}/remittance/v1_0/transfer`,
        {
          amount: remittance.amount,
          currency: remittance.currency,
          externalId: remittance.reference,
          payee: {
            partyIdType: 'MSISDN',
            partyId: remittance.receiverNumber,
          },
          payerMessage: 'Funds Transfer',
          payeeNote: remittance.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.remittance.primaryKey,
          },
        }
      );
      return { referenceId };
    } catch (error: any) {
      console.error('Error sending remittance:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Check Remittance Status (Remittance Service)
  public async getRemittanceStatus(referenceId: string): Promise<any> {
    try {
      const authToken = await this.getAuthToken(this.remittance);
      const response = await axios.get(`${this.getBaseUrl()}/remittance/v1_0/transfer/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.remittance.primaryKey,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error getting remittance status:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}
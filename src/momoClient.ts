import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config();

interface PaymentRequest {
  amount: string;
  phoneNumber: string;
}

interface MoMoClientConfig {
  apiUserId: string;
  apiKey: string;
  primaryKey: string;
  environment?: 'sandbox' | 'production';
}

export class MoMoClient {
  private apiUserId: string;
  private apiKey: string;
  private primaryKey: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor(config: MoMoClientConfig) {
    this.apiUserId = config.apiUserId;
    this.apiKey = config.apiKey;
    this.primaryKey = config.primaryKey;
    this.environment = config.environment || 'sandbox';
    this.baseUrl = `https://${this.environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com`;
  }

  private async getAuthToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/collection/token/`, null, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiUserId}:${this.apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': this.primaryKey,
        },
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error getting auth token:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  public async requestPayment(payment: PaymentRequest): Promise<{ referenceId: string }> {
    const referenceId = uuidv4();
    try {
      const authToken = await this.getAuthToken();
      await axios.post(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          amount: payment.amount,
          currency: 'EUR',
          externalId: '1234560096',
          payer: {
            partyIdType: 'MSISDN',
            partyId: payment.phoneNumber,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.primaryKey,
          },
        }
      );
      return { referenceId };
    } catch (error: any) {
      console.error('Error requesting payment:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  public async getPaymentStatus(referenceId: string): Promise<any> {
    try {
      const authToken = await this.getAuthToken();
      const response = await axios.get(
        `${this.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Ocp-Apim-Subscription-Key': this.primaryKey,
            'X-Target-Environment': this.environment,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting transaction status:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}
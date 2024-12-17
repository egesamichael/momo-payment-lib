import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config();

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

export class MoMoClient {
  private apiUserId: string;
  private apiKey: string;
  private collectionKey?: string;
  private remittanceKey?: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor(config: MoMoClientConfig) {
    this.apiUserId = config.apiUserId;
    this.apiKey = config.apiKey;
    this.collectionKey = config.collectionKey;
    this.remittanceKey = config.remittanceKey;
    this.environment = config.environment || 'sandbox';
    this.baseUrl = `https://${this.environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com`;
  }

  private async getAuthToken(primaryKey: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/token/`, null, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiUserId}:${this.apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': primaryKey,
        },
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error getting auth token:', error.response?.data || error.message);
      throw error;
    }
  }

  public async requestPayment(payment: PaymentRequest): Promise<{ referenceId: string }> {
    if (!this.collectionKey) throw new Error('Collection key is required for payments.');
    const referenceId = uuidv4();
    const authToken = await this.getAuthToken(this.collectionKey);

    try {
      await axios.post(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          amount: payment.amount,
          currency: payment.currency,
          externalId: payment.refrence,
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
            'Ocp-Apim-Subscription-Key': this.collectionKey,
          },
        }
      );
      return { referenceId };
    } catch (error: any) {
      console.error('Error requesting payment:', error.response?.data || error.message);
      throw error;
    }
  }

  public async initiateTransfer(transfer: TransferRequest): Promise<{ referenceId: string }> {
    if (!this.remittanceKey) throw new Error('Remittance key is required for transfers.');
    const referenceId = uuidv4();
    const authToken = await this.getAuthToken(this.remittanceKey);

    try {
      await axios.post(
        `${this.baseUrl}/remittance/v1_0/transfer`,
        {
          amount: transfer.amount,
          currency: transfer.currency,
          externalId: transfer.externalId,
          payee: {
            partyIdType: 'MSISDN',
            partyId: transfer.partyId,
          },
          payerMessage: transfer.payerMessage,
          payeeNote: transfer.payeeNote,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'X-Reference-Id': referenceId,
            'Ocp-Apim-Subscription-Key': this.remittanceKey,
          },
        }
      );
      return { referenceId };
    } catch (error: any) {
      console.error('Error initiating transfer:', error.response?.data || error.message);
      throw error;
    }
  }

  public async getPaymentStatus(referenceId: string): Promise<any> {
    if (!this.collectionKey) throw new Error('Collection key is required for payment status.');
    const authToken = await this.getAuthToken(this.collectionKey);

    try {
      const response = await axios.get(
        `${this.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Ocp-Apim-Subscription-Key': this.collectionKey,
            'X-Target-Environment': this.environment,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting transaction status:', error.response?.data || error.message);
      throw error;
    }
  }
}
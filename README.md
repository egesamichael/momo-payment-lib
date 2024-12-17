
# 🌐 MoMo Payments Library

A TypeScript library for integrating MTN MoMo API to manage various payment-related operations such as Request to Pay, Remittances, Transfers, and more. This library provides a simple interface to interact with the MoMo API, supporting both **sandbox** and **production** environments.

---

## 📦 Installation

Install the package via npm:

```bash
npm install momo-payment-lib
```

---

## 🌟 Features

- 📥 **Request to Pay**: Collect payments from customers.
- 🔍 **Check Transaction Status**: Retrieve the status of payment transactions.
- 💳 **Remittances**: Send money to other users.
- 🔄 **Account Balances**: Fetch balance details for your accounts.
- 🌐 **Environment Support**: Easily switch between **sandbox** and **production**.

---

## 🛠️ Setup

### 1️⃣ **Environment Variables**

Add the following to your `.env` file:

```env
COLLECTION_API_USER_ID=your_collection_api_user_id
COLLECTION_API_KEY=your_collection_api_key
COLLECTION_PRIMARY_KEY=your_collection_primary_key

REMITTANCE_API_USER_ID=your_remittance_api_user_id
REMITTANCE_API_KEY=your_remittance_api_key
REMITTANCE_PRIMARY_KEY=your_remittance_primary_key
```

> Replace placeholders with your MTN MoMo API credentials for each service.

---

## 🚀 Usage

### **Import and Initialize**

Create an instance of `MoMoClient` with separate configurations for each product:

```typescript
import { MoMoClient } from 'momo-payment-lib';

const momoClient = new MoMoClient({
  collection: {
    apiUserId: process.env.COLLECTION_API_USER_ID || '',
    apiKey: process.env.COLLECTION_API_KEY || '',
    primaryKey: process.env.COLLECTION_PRIMARY_KEY || '',
  },
  remittance: {
    apiUserId: process.env.REMITTANCE_API_USER_ID || '',
    apiKey: process.env.REMITTANCE_API_KEY || '',
    primaryKey: process.env.REMITTANCE_PRIMARY_KEY || '',
  },
  environment: 'sandbox', // Use 'sandbox' for testing or 'production' for live
});
```

---

### **Request to Pay**

To request a payment:

```typescript
const requestPayment = async () => {
  try {
    const response = await momoClient.requestPayment({
      amount: 100,
      currency: 'EUR',
      phoneNumber: '256700123456',
      reference: 'Invoice123',
    });
    console.log('Payment requested:', response);
  } catch (error) {
    console.error('Error requesting payment:', error.message);
  }
};

requestPayment();
```

#### 📥 **Request Parameters**

| Parameter      | Type     | Description                           |
|----------------|----------|---------------------------------------|
| `amount`       | `number` | Amount to charge.                    |
| `currency`     | `string` | Currency code (e.g., "UGX", "EUR").  |
| `phoneNumber`  | `string` | Phone number (MSISDN format).        |
| `reference`    | `string` | Your reference number for tracking.  |

#### ✅ **Response**

```json
{
  "referenceId": "unique-identifier"
}
```

---

### **Check Payment Status**

To check the status of a payment:

```typescript
const checkPaymentStatus = async () => {
  try {
    const status = await momoClient.getPaymentStatus('reference-id');
    console.log('Payment status:', status);
  } catch (error) {
    console.error('Error fetching status:', error.message);
  }
};

checkPaymentStatus();
```

#### 📊 **Response**

```json
{
  "amount": "100.00",
  "currency": "EUR",
  "status": "SUCCESSFUL",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "256700123456"
  },
  "reason": null
}
```

---

### **Remittances**

To send money via the remittance API:

```typescript
const sendMoney = async () => {
  try {
    const response = await momoClient.sendRemittance({
      amount: 50,
      currency: 'USD',
      phoneNumber: '256700123456',
      externalId: 'Remittance123',
    });
    console.log('Remittance sent:', response);
  } catch (error) {
    console.error('Error sending remittance:', error.message);
  }
};

sendMoney();
```

---

## 🔗 Full Example

Here’s an end-to-end integration example:

```typescript
import { MoMoClient } from 'momo-payments-lib';
import dotenv from 'dotenv';

dotenv.config();

const momoClient = new MoMoClient({
  collection: {
    apiUserId: process.env.COLLECTION_API_USER_ID || '',
    apiKey: process.env.COLLECTION_API_KEY || '',
    primaryKey: process.env.COLLECTION_PRIMARY_KEY || '',
  },
  remittance: {
    apiUserId: process.env.REMITTANCE_API_USER_ID || '',
    apiKey: process.env.REMITTANCE_API_KEY || '',
    primaryKey: process.env.REMITTANCE_PRIMARY_KEY || '',
  },
  environment: 'sandbox',
});

const processTransaction = async () => {
  try {
    const paymentResponse = await momoClient.requestPayment({
      amount: 100,
      currency: 'UGX',
      phoneNumber: '256700123456',
      reference: 'Invoice001',
    });
    console.log('Payment Requested:', paymentResponse);

    const paymentStatus = await momoClient.getPaymentStatus(paymentResponse.referenceId);
    console.log('Payment Status:', paymentStatus);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

processTransaction();
```

---

## 🤝 Contributing

1. Fork this repository.
2. Implement your changes.
3. Open a pull request with a detailed explanation of your feature or fix.

---

## 📜 License

This library is released under the MIT License.

---

## 📝 Notes

- Ensure you have registered and obtained credentials for each MTN MoMo product from the [MTN Developer Portal](https://momodeveloper.mtn.com/).
- Replace placeholders with actual MSISDN numbers in production environments.
